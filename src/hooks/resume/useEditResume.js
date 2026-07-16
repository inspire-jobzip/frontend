import { useCallback, useEffect, useRef, useState } from "react";

import { resumeApi } from "../../api/resume/resume.api";
import {
  createProjectRequests,
  createResumeFormFromDetail,
  createResumeRequest,
} from "../../api/resume/resume.mappers";
import {
  resumeProjectRequestSchema,
  resumeRequestSchema,
} from "../../api/resume/resume.schemas";

function getErrorMessage(error, fallback) {
  if (error?.issues?.length) return error.issues[0].message;
  return error instanceof Error ? error.message : fallback;
}

export function useEditResume(accessToken, resumeId) {
  const [loadedForm, setLoadedForm] = useState(null);
  const [originalProjectIds, setOriginalProjectIds] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(resumeId));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadAbortRef = useRef(null);

  useEffect(() => {
    if (!accessToken || !resumeId) return undefined;

    const abortController = new AbortController();
    loadAbortRef.current = abortController;
    setIsLoading(true);
    setErrorMessage("");

    resumeApi.getResume({
      accessToken,
      resumeId,
      signal: abortController.signal,
    }).then((resume) => {
      setLoadedForm(createResumeFormFromDetail(resume));
      setOriginalProjectIds(
        resume.projects.map((project) => project.resumeProjectId),
      );
    }).catch((error) => {
      if (error?.name !== "AbortError") {
        setErrorMessage(getErrorMessage(error, "이력서를 불러오지 못했습니다."));
      }
    }).finally(() => {
      if (!abortController.signal.aborted) setIsLoading(false);
    });

    return () => abortController.abort();
  }, [accessToken, resumeId]);

  const saveResume = useCallback(async (form) => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      const resume = resumeRequestSchema.parse(createResumeRequest(form));
      const projects = createProjectRequests(form.projects).map((project) =>
        resumeProjectRequestSchema.parse(project),
      );

      const updatedResume = await resumeApi.updateResume({
        accessToken,
        resumeId,
        resume,
      });

      const retainedIds = projects
        .map((project) => project.resumeProjectId)
        .filter(Boolean);
      const deletedIds = originalProjectIds.filter(
        (projectId) => !retainedIds.includes(projectId),
      );

      await Promise.all([
        ...projects.map((project) => {
          const { resumeProjectId, ...body } = project;
          return resumeProjectId
            ? resumeApi.updateProject({
                accessToken,
                resumeId,
                projectId: resumeProjectId,
                project: body,
              })
            : resumeApi.createProject({
                accessToken,
                resumeId,
                project: body,
              });
        }),
        ...deletedIds.map((projectId) =>
          resumeApi.deleteProject({ accessToken, resumeId, projectId }),
        ),
      ]);

      return updatedResume;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "이력서를 수정하지 못했습니다."));
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [accessToken, originalProjectIds, resumeId]);

  return { loadedForm, isLoading, isSaving, errorMessage, saveResume };
}
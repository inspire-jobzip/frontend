import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  resumeApi,
} from "../../api/resume/resume.api";
import {
  createProjectRequests,
  createResumeRequest,
} from "../../api/resume/resume.mappers";
import {
  resumeProjectRequestSchema,
  resumeRequestSchema,
} from "../../api/resume/resume.schemas";

function getErrorMessage(error) {
  if (error?.issues?.length) {
    return error.issues[0].message;
  }

  return error instanceof Error
    ? error.message
    : "이력서를 저장하지 못했습니다.";
}

export function useCreateResume(accessToken) {
  const [isSaving, setIsSaving] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [partiallySavedResumeId, setPartiallySavedResumeId] =
    useState(null);
  const abortControllerRef = useRef(null);

  const saveResume = useCallback(
    async (form) => {
      abortControllerRef.current?.abort();
      const abortController =
        new AbortController();
      abortControllerRef.current =
        abortController;

      setIsSaving(true);
      setErrorMessage("");
      setPartiallySavedResumeId(null);

      let createdResume = null;

      try {
        const resumeRequest =
          resumeRequestSchema.parse(
            createResumeRequest(form),
          );
        const projectRequests =
          createProjectRequests(
            form.projects,
          ).map((project) =>
            resumeProjectRequestSchema.parse(
              project,
            ),
          );

        createdResume =
          await resumeApi.createResume({
            accessToken,
            resume: resumeRequest,
            signal: abortController.signal,
          });

        for (const project of projectRequests) {
          await resumeApi.createProject({
            accessToken,
            resumeId: createdResume.resumeId,
            project,
            signal: abortController.signal,
          });
        }

        return createdResume;
      } catch (error) {
        if (error?.name === "AbortError") {
          return null;
        }

        if (createdResume) {
          setPartiallySavedResumeId(
            createdResume.resumeId,
          );
          setErrorMessage(
            "이력서는 저장되었지만 프로젝트 일부를 저장하지 못했습니다.",
          );
        } else {
          setErrorMessage(getErrorMessage(error));
        }

        throw error;
      } finally {
        if (
          abortControllerRef.current ===
          abortController
        ) {
          setIsSaving(false);
        }
      }
    },
    [accessToken],
  );

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

  return {
    isSaving,
    errorMessage,
    partiallySavedResumeId,
    saveResume,
  };
}

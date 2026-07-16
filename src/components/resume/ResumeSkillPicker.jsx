import { useEffect, useState } from "react";

import {
  useSkillSearch,
} from "../../hooks/skill/useSkillSearch";
import {
  ResumeFormSection,
} from "./ResumeFormSection";

export function ResumeSkillPicker({
  accessToken,
  selectedSkills,
  onChange,
}) {
  const [keyword, setKeyword] = useState("");
  const {
    skills,
    isLoading,
    errorMessage,
    searchSkills,
    clearSearchResults,
  } = useSkillSearch(accessToken);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      clearSearchResults();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      searchSkills(trimmedKeyword);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [
    keyword,
    searchSkills,
    clearSearchResults,
  ]);

  function addSkill(skill) {
    if (
      selectedSkills.some(
        (selected) =>
          selected.skillId === skill.skillId,
      )
    ) {
      return;
    }

    onChange([...selectedSkills, skill]);
    setKeyword("");
    clearSearchResults();
  }

  function removeSkill(skillId) {
    onChange(
      selectedSkills.filter(
        (skill) => skill.skillId !== skillId,
      ),
    );
  }

  return (
    <ResumeFormSection
      id="skills"
      title="기술 스택"
      description="이력서에 강조할 기술을 검색해 추가해 주세요."
      action={
        <span className="resume-section-count">
          {selectedSkills.length}개 선택
        </span>
      }
    >
      <div className="resume-skill-picker">
        <input
          type="search"
          value={keyword}
          onChange={(event) =>
            setKeyword(event.target.value)
          }
          placeholder="기술명을 입력해 주세요."
          aria-label="기술 스택 검색"
        />

        {keyword.trim() && (
          <div className="resume-skill-picker__results">
            {isLoading && <p>검색 중...</p>}
            {!isLoading && errorMessage && (
              <p role="alert">{errorMessage}</p>
            )}
            {!isLoading &&
              !errorMessage &&
              skills.length === 0 && (
                <p>검색 결과가 없습니다.</p>
              )}
            {!isLoading &&
              skills.map((skill) => (
                <button
                  type="button"
                  key={skill.skillId}
                  onClick={() => addSkill(skill)}
                >
                  <strong>{skill.skillName}</strong>
                  <span>{skill.category}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="resume-selected-skills">
        {selectedSkills.map((skill) => (
          <button
            type="button"
            key={skill.skillId}
            onClick={() =>
              removeSkill(skill.skillId)
            }
            aria-label={`${skill.skillName} 삭제`}
          >
            {skill.skillName} <span>×</span>
          </button>
        ))}
      </div>
    </ResumeFormSection>
  );
}

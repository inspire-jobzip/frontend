import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSkillSearch,
} from "../../hooks/skill/useSkillSearch";

const POPULAR_SKILL_NAMES = [
  "Java",
  "Spring Boot",
  "JavaScript",
  "React",
  "Python",
  "Docker",
];

export function JobSkillSearchModal({
  isOpen,
  selectedSkillNames,
  onApply,
  onClose,
}) {
  const [keyword, setKeyword] = useState("");
  const [draftSkillNames, setDraftSkillNames] =
    useState(selectedSkillNames);

  const {
    skills,
    isLoading,
    errorMessage,
    searchSkills,
    clearSearchResults,
  } = useSkillSearch();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setKeyword("");
    setDraftSkillNames(selectedSkillNames);
    clearSearchResults();
  }, [
    clearSearchResults,
    isOpen,
    selectedSkillNames,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      clearSearchResults();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchSkills(trimmedKeyword);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    clearSearchResults,
    isOpen,
    keyword,
    searchSkills,
  ]);

  const displayedSkillNames = useMemo(() => {
    if (!keyword.trim()) {
      return POPULAR_SKILL_NAMES;
    }

    return skills.map((skill) => skill.skillName);
  }, [keyword, skills]);

  function handleSkillToggle(skillName) {
    setDraftSkillNames((currentSkillNames) => {
      if (currentSkillNames.includes(skillName)) {
        return currentSkillNames.filter(
          (currentSkillName) =>
            currentSkillName !== skillName,
        );
      }

      return [...currentSkillNames, skillName];
    });
  }

  function handleApply() {
    onApply(draftSkillNames);
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="job-skill-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-skill-modal-title"
    >
      <button
        className="job-skill-modal__backdrop"
        type="button"
        aria-label="기술 스택 검색 닫기"
        onClick={onClose}
      />

      <section className="job-skill-modal__content">
        <header className="job-skill-modal__header">
          <div>
            <h2 id="job-skill-modal-title">
              기술 스택 검색
            </h2>

            <p>
              공고 검색에 사용할 기술을 여러 개
              선택할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <input
          type="search"
          value={keyword}
          placeholder="기술 이름을 검색하세요. 예: Spring"
          autoFocus
          onChange={(event) =>
            setKeyword(event.target.value)
          }
        />

        <div className="job-skill-modal__results-header">
          <strong>
            {keyword.trim()
              ? "검색 결과"
              : "인기 기술"}
          </strong>

          <span>{displayedSkillNames.length}개</span>
        </div>

        {errorMessage && (
          <p
            className="job-skill-modal__error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <p className="job-skill-modal__state">
            기술을 검색하고 있습니다.
          </p>
        ) : displayedSkillNames.length === 0 ? (
          <p className="job-skill-modal__state">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="job-skill-modal__list">
            {displayedSkillNames.map((skillName) => {
              const isSelected =
                draftSkillNames.includes(skillName);

              return (
                <li key={skillName}>
                  <span>{skillName}</span>

                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      handleSkillToggle(skillName)
                    }
                  >
                    {isSelected
                      ? "선택됨"
                      : "+ 추가"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <footer className="job-skill-modal__footer">
          <div>
            <strong>
              {draftSkillNames.length}개 선택됨
            </strong>

            <p>
              완료하면 채용공고 필터에 반영됩니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApply}
          >
            선택 완료
          </button>
        </footer>
      </section>
    </div>
  );
}
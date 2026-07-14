import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DESIRED_JOB_ROLE_LABELS,
} from "../../api/auth/auth.constants";
import {
  useSkillSearch,
} from "../../hooks/skill/useSkillSearch";

export function SkillSearchModal({
  isOpen,
  desiredJobRole,
  selectedSkills,
  onChange,
  onClose,
}) {
  const [keyword, setKeyword] = useState("");
  const [draftSkills, setDraftSkills] =
    useState(selectedSkills);

  const {
    skills,
    isLoading,
    errorMessage,
    loadSkills,
    searchSkills,
    clearSearchResults,
  } = useSkillSearch();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // 모달을 다시 열 때 현재 폼의 선택 상태에서 작업본을 새로 만든다.
    setDraftSkills(selectedSkills);
    setKeyword("");
  }, [isOpen, selectedSkills]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      loadSkills();
      return;
    }

    // 입력이 멈춘 뒤 검색해 키 입력마다 API가 호출되는 것을 방지한다.
    const timeoutId = window.setTimeout(() => {
      searchSkills(trimmedKeyword);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    keyword,
    isOpen,
    loadSkills,
    searchSkills,
    clearSearchResults,
  ]);

  const displayedSkills = useMemo(() => {
    // 검색어가 없을 때는 서버 검색 결과 대신 직무별 추천 목록을 보여준다.
    return skills;
  }, [skills]);

  function isSkillSelected(skillId) {
    return draftSkills.some(
      (skill) => skill.skillId === skillId,
    );
  }

  function handleSkillToggle(skill) {
    if (isSkillSelected(skill.skillId)) {
      setDraftSkills((currentSkills) =>
        currentSkills.filter(
          (currentSkill) =>
            currentSkill.skillId !== skill.skillId,
        ),
      );

      return;
    }

    setDraftSkills((currentSkills) => [
      ...currentSkills,
      skill,
    ]);
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  function handleKeywordClear() {
    setKeyword("");
    clearSearchResults();
  }

  function handleApply() {
    // 닫기 버튼은 변경을 버리고, 선택 완료만 작업본을 부모 폼에 반영한다.
    onChange(draftSkills);
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  const roleLabel = desiredJobRole
    ? DESIRED_JOB_ROLE_LABELS[desiredJobRole]
    : null;

  const hasKeyword = Boolean(keyword.trim());
  const hasResults = displayedSkills.length > 0;

  return (
    <div
      className="skill-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
    >
      <button
        className="skill-modal__backdrop"
        type="button"
        aria-label="기술 검색 닫기"
        onClick={onClose}
      />

      <section className="skill-modal__content">
        <header className="skill-modal__header">
          <div>
            <h2 id="skill-modal-title">
              기술 스택 검색
            </h2>

            <p>
              키워드로 기술을 찾고 여러 개
              선택할 수 있어요.
            </p>
          </div>

          <button
            className="skill-modal__close"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        {roleLabel && (
          <p className="skill-modal__role">
            {roleLabel} 직무 관련 기술 우선
          </p>
        )}

        <input
          className="skill-modal__search"
          type="search"
          value={keyword}
          onChange={handleKeywordChange}
          placeholder="기술 이름을 검색하세요. 예: Spring"
          autoFocus
        />

        <div className="skill-modal__results-header">
          <strong>
            {hasKeyword
              ? "검색 결과"
              : `${roleLabel ?? "직무"} 추천 기술`}
          </strong>

          <span>
            {displayedSkills.length}개
          </span>
        </div>

        {errorMessage && (
          <p
            className="skill-modal__error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <p className="skill-modal__empty">
            Loading skills...
          </p>
        ) : !hasResults && hasKeyword ? (
          <div className="skill-modal__empty">
            <strong>검색 결과가 없어요</strong>

            <p>
              “{keyword}”와 일치하는 기술을
              찾지 못했습니다.
            </p>

            <button
              type="button"
              onClick={handleKeywordClear}
            >
              검색어 지우기
            </button>
          </div>
        ) : (
          <ul className="skill-modal__list">
            {displayedSkills.map((skill) => {
              const isSelected =
                isSkillSelected(skill.skillId);

              return (
                <li
                  className="skill-modal__item"
                  key={skill.skillId}
                >
                  <div>
                    <strong>
                      {skill.skillName}
                    </strong>

                    <span>
                      {skill.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      handleSkillToggle(skill)
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

        <footer className="skill-modal__footer">
          <div>
            <strong>
              {draftSkills.length}개 선택됨
            </strong>

            <p>
              완료하면 회원가입 폼에 반영됩니다.
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

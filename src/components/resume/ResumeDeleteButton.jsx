import { useState } from "react";

import { resumeApi } from "../../api/resume/resume.api";

export function ResumeDeleteButton({
  accessToken,
  resumeId,
  resumeTitle,
  onDeleted,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage("");

    try {
      await resumeApi.deleteResume({ accessToken, resumeId });
      setIsOpen(false);
      onDeleted();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "이력서를 제거하지 못했습니다.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        className="resume-delete-button"
        type="button"
        disabled={disabled || isDeleting}
        onClick={() => setIsOpen(true)}
      >
        이력서 제거
      </button>

      {isOpen && (
        <div
          className="resume-delete-confirm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-delete-confirm-title"
        >
          <button
            className="resume-delete-confirm__backdrop"
            type="button"
            aria-label="이력서 제거 확인 닫기"
            onClick={() => setIsOpen(false)}
          />
          <section>
            <h2 id="resume-delete-confirm-title">이력서를 제거할까요?</h2>
            <p>
              <strong>{resumeTitle}</strong> 이력서는 제거 후 복구할 수 없습니다.
            </p>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "제거 중..." : "제거"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
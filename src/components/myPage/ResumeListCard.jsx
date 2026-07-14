import { useState } from "react";
import { Link } from "react-router-dom";

function formatUpdatedAt(updatedAt) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(updatedAt));
}

export function ResumeListCard({
  resumes,
  pendingResumeIds,
  onDelete,
}) {
  const [openMenuId, setOpenMenuId] =
    useState(null);
  const [deleteTarget, setDeleteTarget] =
    useState(null);

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    try {
      await onDelete(deleteTarget.resumeId);
      setDeleteTarget(null);
      setOpenMenuId(null);
    } catch {
      // 상위 페이지에서 오류를 안내하고 사용자가 다시 시도할 수 있도록 확인창을 유지한다.
    }
  }

  return (
    <section className="my-page-card resume-list-card">
      <div>
        <header className="my-page-card__heading">
          <h2>내 이력서</h2>
          <Link to="/resume/new">
            + 새 이력서
          </Link>
        </header>

        {resumes.length > 0 ? (
          <div className="resume-list-card__scroll">
            <ul className="resume-list-card__list">
              {resumes.map((resume) => {
                const isPending =
                  pendingResumeIds.includes(
                    resume.resumeId,
                  );

                return (
                  <li
                    className="resume-item"
                    key={resume.resumeId}
                  >
                    <Link
                      className="resume-item__link"
                      to={`/resume/${resume.resumeId}`}
                    >
                      <span
                        className="resume-item__icon"
                        aria-hidden="true"
                      >
                        ▤
                      </span>

                      <span className="resume-item__copy">
                        <strong>
                          {resume.title}
                          {resume.isDefault && (
                            <em>기본</em>
                          )}
                        </strong>
                        <small>
                          최근 수정{" "}
                          {formatUpdatedAt(
                            resume.updatedAt,
                          )}
                        </small>
                      </span>
                    </Link>

                    <button
                      className="resume-item__more"
                      type="button"
                      aria-label={`${resume.title} 메뉴 열기`}
                      aria-expanded={
                        openMenuId ===
                        resume.resumeId
                      }
                      disabled={isPending}
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId ===
                            resume.resumeId
                            ? null
                            : resume.resumeId,
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenuId ===
                      resume.resumeId && (
                      <div className="resume-item__menu">
                        <Link
                          to={`/resume/${resume.resumeId}`}
                        >
                          수정
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(resume)
                          }
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="my-page-empty-state">
            <strong>
              작성한 이력서가 없습니다.
            </strong>
            <p>
              첫 이력서를 작성하고 공고와
              비교해보세요.
            </p>
            <Link to="/resume/new">
              새 이력서 작성
            </Link>
          </div>
        )}
      </div>

      <Link
        className="my-page-card__primary-button"
        to="/resume"
      >
        이력서 전체 관리
      </Link>

      {deleteTarget && (
        <div
          className="resume-delete-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-delete-title"
        >
          <button
            className="resume-delete-dialog__backdrop"
            type="button"
            aria-label="삭제 확인 닫기"
            onClick={() =>
              setDeleteTarget(null)
            }
          />

          <section>
            <h3 id="resume-delete-title">
              이력서를 삭제할까요?
            </h3>
            <p>
              ‘{deleteTarget.title}’ 이력서는
              삭제 후 복구할 수 없습니다.
            </p>
            <div>
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
              >
                삭제
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

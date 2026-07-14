import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  clearAuthSession,
  getAuthSession,
} from "../api/auth/auth.session";
import {
  BookmarkListCard,
} from "../components/myPage/BookmarkListCard";
import {
  MyPageHeader,
} from "../components/myPage/MyPageHeader";
import {
  MyPageSkeleton,
} from "../components/myPage/MyPageSkeleton";
import {
  ProfileCard,
} from "../components/myPage/ProfileCard";
import {
  ProfileEditModal,
} from "../components/myPage/ProfileEditModal";
import {
  ResumeListCard,
} from "../components/myPage/ResumeListCard";
import {
  useMyPage,
} from "../hooks/myPage/useMyPage";
import "../styles/auth.css";
import "../styles/my-page.css";

export function MyPagePage() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const accessToken = session?.accessToken;
  const [isProfileEditOpen, setIsProfileEditOpen] =
    useState(false);
  const [toastMessage, setToastMessage] =
    useState("");

  const {
    myPageData,
    isLoading,
    isSavingProfile,
    pendingBookmarkIds,
    pendingResumeIds,
    errorMessage,
    isUnauthorized,
    retry,
    saveProfile,
    removeBookmark,
    removeResume,
  } = useMyPage(accessToken);

  const showToast = useCallback((message) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  useEffect(() => {
    if (!isUnauthorized) {
      return;
    }

    clearAuthSession();
    navigate("/auth", { replace: true });
  }, [isUnauthorized, navigate]);

  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }

  async function handleProfileSave(
    profileRequest,
  ) {
    await saveProfile(profileRequest);
    showToast("프로필이 수정되었습니다.");
  }

  async function handleBookmarkRemove(
    jobNoticeId,
  ) {
    try {
      await removeBookmark(jobNoticeId);
      showToast("스크랩이 해제되었습니다.");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "스크랩을 해제하지 못했습니다.",
      );
    }
  }

  async function handleResumeDelete(resumeId) {
    try {
      await removeResume(resumeId);
      showToast("이력서가 삭제되었습니다.");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "이력서를 삭제하지 못했습니다.",
      );
      throw error;
    }
  }

  return (
    <div className="my-page">
      <MyPageHeader />

      <main>
        <section className="my-page-intro">
          <h1>마이페이지</h1>
          <p>
            내 프로필과 스크랩 공고, 이력서를
            한눈에 관리하세요.
          </p>
        </section>

        {isLoading && <MyPageSkeleton />}

        {!isLoading && errorMessage && (
          <section
            className="my-page-load-error"
            role="alert"
          >
            <strong>
              마이페이지를 불러오지 못했습니다.
            </strong>
            <p>{errorMessage}</p>
            <button type="button" onClick={retry}>
              다시 시도
            </button>
          </section>
        )}

        {!isLoading && myPageData && (
          <div className="my-page-layout">
            <ProfileCard
              profile={myPageData.profile}
              onEdit={() =>
                setIsProfileEditOpen(true)
              }
            />

            <BookmarkListCard
              bookmarks={myPageData.bookmarks}
              pendingBookmarkIds={
                pendingBookmarkIds
              }
              onRemove={handleBookmarkRemove}
            />

            <ResumeListCard
              resumes={myPageData.resumes}
              pendingResumeIds={pendingResumeIds}
              onDelete={handleResumeDelete}
            />
          </div>
        )}
      </main>

      {myPageData && (
        <ProfileEditModal
          isOpen={isProfileEditOpen}
          profile={myPageData.profile}
          isSaving={isSavingProfile}
          onSave={handleProfileSave}
          onClose={() =>
            setIsProfileEditOpen(false)
          }
        />
      )}

      {toastMessage && (
        <div
          className="my-page-toast"
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

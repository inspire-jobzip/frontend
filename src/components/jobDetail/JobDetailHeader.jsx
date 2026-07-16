import { Link } from "react-router-dom";

export function JobDetailHeader({
  authSession,
  onLogout,
}) {
  return (
    <header className="job-detail-header">
      <Link className="job-detail-header__brand" to="/">
        dejavu
      </Link>

      <nav aria-label="주요 메뉴">
        <Link to="/jobs" aria-current="page">
          채용공고
        </Link>
        <Link to="/calendar">캘린더</Link>
        <Link to="/resume">이력서</Link>
        {authSession ? (
          <>
            <span className="job-detail-header__user">
              {authSession.user.name ??
                authSession.user.email}
              님
            </span>
            <Link
              className="job-detail-header__mypage"
              to="/mypage"
            >
              마이페이지
            </Link>
            <button
              className="job-detail-header__session"
              type="button"
              onClick={onLogout}
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            className="job-detail-header__session"
            to="/auth"
          >
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}

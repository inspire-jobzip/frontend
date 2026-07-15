import { Link } from "react-router-dom";

export function CalendarHeader({
  authSession,
  onLogout,
}) {
  return (
    <header className="calendar-header">
      <Link className="calendar-header__brand" to="/">
        dejavu
      </Link>

      <nav aria-label="주요 메뉴">
        <Link to="/jobs">채용공고</Link>
        <Link
          className="calendar-header__active"
          to="/calendar"
          aria-current="page"
        >
          캘린더
        </Link>
        {authSession ? (
          <>
            <Link
              className="calendar-header__mypage"
              to="/mypage"
            >
              마이페이지
            </Link>
            <button type="button" onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link
            className="calendar-header__login"
            to="/auth"
          >
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}

import { Link } from "react-router-dom";

export function MyPageHeader() {
  return (
    <header className="my-page-header">
      <Link
        className="my-page-header__brand"
        to="/"
      >
        dejavu
      </Link>

      <nav aria-label="주요 메뉴">
        <Link to="/jobs">채용공고</Link>
        <Link to="/calendar">캘린더</Link>
        <Link
          className="my-page-header__active"
          to="/mypage"
          aria-current="page"
        >
          마이페이지
        </Link>
      </nav>
    </header>
  );
}

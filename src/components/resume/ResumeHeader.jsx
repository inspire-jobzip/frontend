import { Link } from "react-router-dom";

export function ResumeHeader() {
  return (
    <header className="resume-header">
      <Link
        className="resume-header__brand"
        to="/jobs"
      >
        dejavu
      </Link>

      <nav aria-label="주요 메뉴">
        <Link to="/jobs">채용공고</Link>
        <Link to="/calendar">캘린더</Link>
        <span aria-current="page">이력서</span>
        <Link to="/mypage">마이페이지</Link>
      </nav>
    </header>
  );
}

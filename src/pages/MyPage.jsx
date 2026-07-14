import { Link } from "react-router-dom";

import {
  CAREER_STATUS_LABELS,
  DESIRED_JOB_ROLE_LABELS,
} from "../api/auth/auth.constants";
import "../styles/mypage.css";

export function MyPage({ authSession, onLogout }) {
  const { user } = authSession;

  return (
    <div className="mypage">
      <header className="mypage__header">
        <Link className="mypage__brand" to="/jobs">
          dejavu
        </Link>
        <nav aria-label="주요 메뉴">
          <Link to="/jobs">채용공고</Link>
          <button type="button" onClick={onLogout}>
            로그아웃
          </button>
        </nav>
      </header>

      <main className="mypage__main">
        <p className="mypage__eyebrow">MY PAGE</p>
        <h1>마이페이지</h1>
        <p className="mypage__signed-in">
          로그인된 계정입니다.
        </p>

        <section className="mypage__profile">
          <h2>내 정보</h2>
          <dl>
            <div>
              <dt>이메일</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>희망 직무</dt>
              <dd>
                {DESIRED_JOB_ROLE_LABELS[
                  user.desiredJobRole
                ] ?? user.desiredJobRole}
              </dd>
            </div>
            <div>
              <dt>경력 구분</dt>
              <dd>
                {CAREER_STATUS_LABELS[
                  user.careerStatus
                ] ?? user.careerStatus}
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}

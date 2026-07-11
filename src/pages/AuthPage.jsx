import { useState } from "react";

import {
  AuthTabs,
} from "../components/auth/AuthTabs";
import {
  LoginForm,
} from "../components/auth/LoginForm";
import {
  SignupForm,
} from "../components/auth/SignupForm";
import "../styles/auth.css";

export function AuthPage({
  recommendedSkills = [],
  onLoginSuccess = () => {},
  onSignupSuccess = () => {},
}) {
  const [activeTab, setActiveTab] =
    useState("login");

  const isLoginTab = activeTab === "login";

  function handleSignupSuccess(signupData) {
    onSignupSuccess(signupData);
    setActiveTab("login");
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <a
          className="auth-header__brand"
          href="/"
        >
          dejavu
        </a>

        <nav
          className="auth-header__navigation"
          aria-label="주요 메뉴"
        >
          <a href="/jobs">채용공고</a>
          <a href="/calendar">캘린더</a>
          <a href="/resume">이력서</a>

          <button
            type="button"
            onClick={() =>
              setActiveTab("login")
            }
          >
            로그인
          </button>
        </nav>
      </header>

      <main className="auth-page__main">
        <section className="auth-hero">
          <div className="auth-hero__content">
            <p className="auth-hero__eyebrow">
              YOUR NEXT ROLE, CLEARLY
            </p>

            <h1>
              내 기술과 잘 맞는
              <br />
              채용공고를 더 빠르게
            </h1>

            <p className="auth-hero__description">
              기술 스택 기반 추천부터 공고 분석,
              이력서 비교까지
              <br />
              dejavu에서 하나의 흐름으로
              관리하세요.
            </p>
          </div>

          <p className="auth-hero__footer">
            AI 기반 개발자 채용공고 분석 플랫폼
          </p>
        </section>

        <section
          className={
            isLoginTab
              ? "auth-card"
              : "auth-card auth-card--signup"
          }
        >
          <AuthTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {isLoginTab ? (
            <div
              id="auth-panel-login"
              role="tabpanel"
              aria-labelledby="auth-tab-login"
            >
              <LoginForm
                onLoginSuccess={
                  onLoginSuccess
                }
              />
            </div>
          ) : (
            <div
              id="auth-panel-signup"
              role="tabpanel"
              aria-labelledby="auth-tab-signup"
            >
              <SignupForm
                recommendedSkills={
                  recommendedSkills
                }
                onSignupSuccess={
                  handleSignupSuccess
                }
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

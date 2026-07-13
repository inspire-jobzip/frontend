const AUTH_TABS = [
  {
    value: "login",
    label: "로그인",
  },
  {
    value: "signup",
    label: "회원가입",
  },
];

export function AuthTabs({
  activeTab,
  onChange,
}) {
  return (
    <div
      className="auth-tabs"
      role="tablist"
      aria-label="인증 방식 선택"
    >
      {AUTH_TABS.map((tab) => {
        const isActive =
          activeTab === tab.value;

        return (
          <button
            key={tab.value}
            id={`auth-tab-${tab.value}`}
            className={
              isActive
                ? "auth-tabs__item auth-tabs__item--active"
                : "auth-tabs__item"
            }
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={
              `auth-panel-${tab.value}`
            }
            onClick={() =>
              onChange(tab.value)
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
import {
  CAREER_STATUS_LABELS,
  DESIRED_JOB_ROLE_LABELS,
} from "../../api/auth/auth.constants";

export function ProfileCard({
  profile,
  onEdit,
}) {
  const roleLabel =
    DESIRED_JOB_ROLE_LABELS[
      profile.desiredJobRole
    ] ?? profile.desiredJobRole;
  const careerLabel =
    CAREER_STATUS_LABELS[
      profile.careerStatus
    ] ?? profile.careerStatus;
  const careerDescription =
    profile.careerStatus === "EXPERIENCED"
      ? `${careerLabel} ${profile.careerYears}년`
      : careerLabel;

  return (
    <section className="my-page-card profile-card">
      <div>
        <h2>내 프로필</h2>

        <div className="profile-card__identity">
          <div
            className="profile-card__avatar"
            aria-hidden="true"
          >
            MY
          </div>

          <div>
            <strong>{roleLabel} 개발자</strong>
            <span>{careerDescription}</span>
          </div>
        </div>

        <dl className="profile-card__details">
          <div>
            <dt>희망 직무</dt>
            <dd>{roleLabel} 개발자</dd>
          </div>

          <div>
            <dt>경력 정보</dt>
            <dd>{careerDescription}</dd>
          </div>

          <div>
            <dt>관심 기술</dt>
            <dd>
              {profile.preferredSkillNames.length >
              0 ? (
                <ul className="profile-card__skills">
                  {profile.preferredSkillNames.map(
                    (skillName) => (
                      <li key={skillName}>
                        {skillName}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <span className="profile-card__empty">
                  등록된 관심 기술이 없습니다.
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <button
        className="my-page-card__primary-button"
        type="button"
        onClick={onEdit}
      >
        프로필 수정
      </button>
    </section>
  );
}

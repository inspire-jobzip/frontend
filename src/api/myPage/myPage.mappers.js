export function createUpdateProfileRequest({
  desiredJobRole,
  careerStatus,
  careerYears,
  selectedSkills,
}) {
  return {
    desiredJobRole,
    careerStatus,
    careerYears:
      careerStatus === "NEW"
        ? 0
        : Number(careerYears),
    preferredSkillNames: selectedSkills.map(
      (skill) => skill.skillName,
    ),
  };
}

export function createProfileSkills(
  preferredSkillNames = [],
) {
  return preferredSkillNames.map(
    (skillName, index) => ({
      skillId: `profile-${index}-${skillName}`,
      skillName,
      category: "관심 기술",
    }),
  );
}

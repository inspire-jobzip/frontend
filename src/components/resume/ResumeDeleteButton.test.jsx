import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { resumeApi } from "../../api/resume/resume.api";
import { ResumeDeleteButton } from "./ResumeDeleteButton";

jest.mock("../../api/resume/resume.api", () => ({
  resumeApi: { deleteResume: jest.fn() },
}));

test("confirms and deletes a resume", async () => {
  resumeApi.deleteResume.mockResolvedValue({ message: "삭제되었습니다." });
  const onDeleted = jest.fn();

  render(
    <ResumeDeleteButton
      accessToken="token"
      resumeId={10}
      resumeTitle="Backend Resume"
      onDeleted={onDeleted}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "이력서 제거" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "제거" }));

  await waitFor(() => {
    expect(resumeApi.deleteResume).toHaveBeenCalledWith({
      accessToken: "token",
      resumeId: 10,
    });
    expect(onDeleted).toHaveBeenCalledTimes(1);
  });
});
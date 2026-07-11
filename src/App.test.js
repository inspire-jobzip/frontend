import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders the authentication page", () => {
  render(<App />);

  expect(
    screen.getByRole("tab", { name: "로그인" }),
  ).toHaveAttribute("aria-selected", "true");
});

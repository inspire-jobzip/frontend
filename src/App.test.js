import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";

test("renders the authentication page", () => {
  render(
    <MemoryRouter initialEntries={["/auth"]}>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("tab", { name: "로그인" }),
  ).toHaveAttribute("aria-selected", "true");
});
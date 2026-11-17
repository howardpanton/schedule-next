import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

// Replace the Server Action with a fake that always rejects the password.
vi.mock("@/app/actions/auth", () => ({
  login: vi.fn(async (_state: unknown, formData: FormData) => ({
    error: "Email or password is incorrect.",
    email: formData.get("email"),
  })),
}));

describe("LoginForm", () => {
  it("shows the action's error and keeps the email", async () => {
    const user = userEvent.setup();
    render(<LoginForm next="/schedule" />);

    await user.type(screen.getByLabelText("Email"), "demo@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    expect(screen.getByLabelText("Email")).toHaveValue("demo@example.com");
  });

  it("sends the page to return to with the form", () => {
    const { container } = render(<LoginForm next="/schedule" />);
    expect(container.querySelector('input[name="next"]')).toHaveValue("/schedule");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AboutModal from "../AboutModal";

const markdown = `# About Luno

*A calmer way to focus.*

## How to Use Luno

1.  **Add a task.** Write it down.
2.  **Start when ready.**

-   **Make a start feel manageable.** Small steps.

------------------------------------------------------------------------

Read [the guide](https://www.pomodorotechnique.com/) or *stop*.
`;

function stubFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, text: async () => markdown })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AboutModal", () => {
  it("should render the about markdown", async () => {
    stubFetch();

    render(<AboutModal onClose={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "About Luno" }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: "How to Use Luno" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Add a task.")).toBeInTheDocument();
    expect(
      screen.getByText("Make a start feel manageable."),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "the guide" });

    expect(link).toHaveAttribute("href", "https://www.pomodorotechnique.com/");
    expect(screen.getByText("stop")).toBeInTheDocument();
  });

  it("should close from the icon, the footer button, and Escape", async () => {
    stubFetch();

    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<AboutModal onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Close" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "GOT IT" }));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("should show a fallback when the content cannot load", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404 })));

    render(<AboutModal onClose={vi.fn()} />);

    expect(
      await screen.findByText("Could not load the about content."),
    ).toBeInTheDocument();
  });
});

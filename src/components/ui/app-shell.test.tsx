import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders its title and content", () => {
    render(
      <AppShell title="Foundation">
        <p>Ready</p>
      </AppShell>,
    );

    expect(screen.getByRole("heading", { name: "Foundation" })).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});

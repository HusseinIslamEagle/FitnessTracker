import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import Workouts from "../Workouts";

// mock hook
vi.mock("../../hook/useExercises", () => ({
  useExercises: () => ({
    items: [
      {
        id: 1,
        name: "Bench Press",
        description: "Chest exercise",
        category: "Chest",
        equipment: ["Barbell"],
        muscles: ["Pectoralis major"],
        musclesSecondary: ["Triceps brachii"],
      },
      {
        id: 2,
        name: "Pull Up",
        description: "Back exercise",
        category: "Back",
        equipment: ["Bodyweight"],
        muscles: ["Latissimus dorsi"],
        musclesSecondary: [],
      },
    ],
    loading: false,
    error: null,
    loadMore: vi.fn(),
    canLoadMore: false,
    refetch: vi.fn(),
    count: 2,
  }),
}));

describe("Workouts Exercise Library", () => {
  it("filters by search query", async () => {
    const user = userEvent.setup();
    render(<Workouts />);

    // اتأكد ان الاتنين موجودين
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Pull Up")).toBeInTheDocument();

    // search
    const search = screen.getByPlaceholderText("Search exercises...");
    await user.type(search, "bench");

    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.queryByText("Pull Up")).not.toBeInTheDocument();
  });
  it("sorts exercises by name (Z-A)", async () => {
    const user = userEvent.setup();
    render(<Workouts />);

    const sortSelect = screen.getByLabelText("Sort exercises");
    await user.selectOptions(sortSelect, "name-desc");

    const grid = screen.getByTestId("exercise-library-grid");
    const cards = within(grid).getAllByTestId("exercise-card");

    expect(within(cards[0]).getByText("Pull Up")).toBeInTheDocument();
    expect(within(cards[1]).getByText("Bench Press")).toBeInTheDocument();
  });

});

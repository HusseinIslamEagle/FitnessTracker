// src/shared/domain/__tests__/workoutsRepository.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

import { loadWorkouts, saveWorkouts, migrateIfNeeded } from "../workoutsRepository";

// Mock the storage layer (so tests don't touch localStorage directly)
vi.mock("@/shared/lib/storage/workoutsStorage", () => {
  return {
    getWorkoutsKey: vi.fn(),
    readWorkoutsByKey: vi.fn(),
    writeWorkoutsByKey: vi.fn(),
    migrateGuestToUnlimitedIfNeeded: vi.fn(),
  };
});

import {
  getWorkoutsKey,
  readWorkoutsByKey,
  writeWorkoutsByKey,
  migrateGuestToUnlimitedIfNeeded,
} from "@/shared/lib/storage/workoutsStorage";

describe("workoutsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loadWorkouts: uses getWorkoutsKey and returns readWorkoutsByKey result", () => {
    const fakeKey = "some_key";
    const fakeData = [{ id: 1, exercise: "Bench" }];

    getWorkoutsKey.mockReturnValue(fakeKey);
    readWorkoutsByKey.mockReturnValue(fakeData);

    const result = loadWorkouts(true);

    expect(getWorkoutsKey).toHaveBeenCalledTimes(1);
    expect(getWorkoutsKey).toHaveBeenCalledWith(true);

    expect(readWorkoutsByKey).toHaveBeenCalledTimes(1);
    expect(readWorkoutsByKey).toHaveBeenCalledWith(fakeKey);

    expect(result).toEqual(fakeData);
  });

  it("saveWorkouts: uses getWorkoutsKey and calls writeWorkoutsByKey with workouts", () => {
    const fakeKey = "another_key";
    const workouts = [{ id: 2, exercise: "Squat" }];

    getWorkoutsKey.mockReturnValue(fakeKey);

    saveWorkouts(false, workouts);

    expect(getWorkoutsKey).toHaveBeenCalledTimes(1);
    expect(getWorkoutsKey).toHaveBeenCalledWith(false);

    expect(writeWorkoutsByKey).toHaveBeenCalledTimes(1);
    expect(writeWorkoutsByKey).toHaveBeenCalledWith(fakeKey, workouts);
  });

  it("migrateIfNeeded: calls migrateGuestToUnlimitedIfNeeded only when authed", () => {
    migrateIfNeeded(false);
    expect(migrateGuestToUnlimitedIfNeeded).not.toHaveBeenCalled();

    migrateIfNeeded(true);
    expect(migrateGuestToUnlimitedIfNeeded).toHaveBeenCalledTimes(1);
  });
});
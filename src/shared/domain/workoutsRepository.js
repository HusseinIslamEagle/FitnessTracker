// src/shared/domain/workoutsRepository.js

import {
  getWorkoutsKey,
  readWorkoutsByKey,
  writeWorkoutsByKey,
  migrateGuestToUnlimitedIfNeeded,
} from "@/shared/lib/storage/workoutsStorage";

export function loadWorkouts(isAuthed) {
  const key = getWorkoutsKey(isAuthed);
  return readWorkoutsByKey(key);
}

export function saveWorkouts(isAuthed, workouts) {
  const key = getWorkoutsKey(isAuthed);
  writeWorkoutsByKey(key, workouts);
}

export function migrateIfNeeded(isAuthed) {
  if (isAuthed) migrateGuestToUnlimitedIfNeeded();
}
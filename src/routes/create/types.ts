import type { Workout } from "$lib/composables/exercises";

export interface Session {
    workouts: (Workout & { sets: number })[];
}

export interface Week {
    rir: number;
}

export interface WorkoutPlan {
    name: string;
    sessions: Session[];
    weeks: Week[];
}

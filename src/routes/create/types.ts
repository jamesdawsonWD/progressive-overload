import type { Workout } from "$lib/composables/exercises";

export interface Session {
    workouts: (Workout & { sets: number })[];
    completed: boolean;
}

export interface Week {
    rir: number;
    sessions: Session[];
}

export interface WorkoutPlan {
    name: string;
    weeks: Week[];
}

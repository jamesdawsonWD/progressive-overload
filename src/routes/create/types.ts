import type { Workout } from "$lib/composables/exercises";

export interface Session {
    workouts: (Workout & {
        sets: {
            weight: string;
            reps: string;
            completed: boolean;
        }[];
    })[];
    completed: boolean;
    id: string;
}

export interface Week {
    rir: number;
    sessions: Session[];
}

export interface WorkoutPlan {
    name: string;
    weeks: Week[];
}

export interface WorkoutPlans {
    workoutPlans: WorkoutPlan[];
}

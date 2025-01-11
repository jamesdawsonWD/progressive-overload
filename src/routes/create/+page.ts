import type { PageLoad } from "./$types";
import { availableWorkouts } from "$lib/composables/exercises";
export const load: PageLoad = ({ params }) => {
    return {
        post: {
            workouts: availableWorkouts.map((workout) => {
                return {
                    label: workout.name,
                    value: workout.id,
                };
            }),
        },
    };
};

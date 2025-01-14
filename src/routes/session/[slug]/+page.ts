import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    const { slug } = params;

    console.log(slug);
    if (slug) {
        // Directly return the slug for use in the Svelte component
        return { slug };
    }

    error(404, "Not found");
};

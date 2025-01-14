<!-- /sessions/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { Session, WorkoutPlan } from '../../create/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import { getMuscleGroupName } from '$lib/composables/exercises';

	let { data }: { data: PageData } = $props();

	let session: Session | null = null;

	function getWorkoutPlan(): WorkoutPlan | null {
		try {
			const storedPlan = localStorage.getItem('workoutPlan');
			if (storedPlan) {
				return JSON.parse(storedPlan) as WorkoutPlan;
			}
			return null;
		} catch (error) {
			console.error('Error retrieving workout plan:', error);
			return null;
		}
	}

	$effect: {
		const workoutPlan = getWorkoutPlan();
		if (workoutPlan) {
			for (const week of workoutPlan.weeks) {
				const foundSession = week.sessions.find((s) => s.id === data.slug);
				if (foundSession) {
					session = foundSession;
				}
			}
		}
	}

	function markAsCompleted() {
		if (session) {
			session.completed = true;
			const workoutPlan = getWorkoutPlan();
			if (workoutPlan) {
				workoutPlan.weeks.forEach((week) => {
					week.sessions = week.sessions.map((s) => (s.id === session?.id ? session : s));
				});
				localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
			}
		}
	}
</script>

{#if session}
	<h1 class="mb-16 text-2xl font-bold text-white">Session Details</h1>
	<Card.Root>
		<Card.Header>
			<Card.Title>Session ID: {session.id}</Card.Title>
			<Badge class="mt-2">{session.completed ? 'Completed' : 'Incomplete'}</Badge>
		</Card.Header>

		<Card.Content>
			<ul class="mt-4 space-y-4">
				{#each session.workouts as workout}
					<li class="flex flex-col gap-2">
						<Badge>{getMuscleGroupName(workout.muscleGroupId)}</Badge>
						<h3>{workout.name}</h3>

						{#each Array.from({ length: workout.sets }, (_, index) => index + 1) as set}
							<div>Set {set}</div>
						{/each}
					</li>
				{/each}
			</ul>
		</Card.Content>

		<Card.Footer class="mt-6 flex justify-between">
			<Button variant="outline" on:click={markAsCompleted}>Mark as Completed</Button>
			<Button variant="destructive">Delete Session</Button>
		</Card.Footer>
	</Card.Root>
{:else}
	<p>Loading session...</p>
{/if}

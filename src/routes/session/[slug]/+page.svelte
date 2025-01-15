<!-- /sessions/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { Session, WorkoutPlan } from '../../create/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import { getMuscleGroupName } from '$lib/composables/exercises';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	let { data }: { data: PageData } = $props();

	let session: Session | null = null;
	let workoutName: string | null = null;
	let weekIndex: number | null = null;
	let sessionIndex: number | null = null;

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
			for (const [index, week] of workoutPlan.weeks.entries()) {
				const foundSessionIndex = week.sessions.findIndex((s) => s.id === data.slug);
				if (foundSessionIndex !== -1) {
					session = week.sessions[foundSessionIndex];
					workoutName = workoutPlan.name;
					weekIndex = index;
					sessionIndex = foundSessionIndex;
					break; // Exit the loop once the session is found
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
	function updateWorkoutDetails(
		weekIndex: number,
		sessionIndex: number,
		workoutIndex: number,
		setIndex: number,
		key: 'weight' | 'reps' | 'completed',
		value: string | boolean
	) {
		if (session) {
			const workoutPlan = getWorkoutPlan();
			if (workoutPlan && weekIndex !== undefined) {
				console.log(sessionIndex, workoutPlan.weeks[weekIndex].sessions[sessionIndex]);
				const set =
					workoutPlan.weeks[weekIndex].sessions[sessionIndex].workouts[workoutIndex].sets[setIndex];

				console.log(set);
				// Use type assertion to let TypeScript know the property exists
				(set as Record<string, string | boolean>)[key] = value;

				localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
			}
		}
	}
</script>

{#if session}
	<h1 class="mb-4 text-2xl font-bold">
		Week {weekIndex + 1} - Day {sessionIndex + 1}
	</h1>

	<div class="space-y-2">
		{#each session.workouts as workout, workoutIndex}
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<span>
							<Badge>{getMuscleGroupName(workout.muscleGroupId)}</Badge>
						</span>
						<h3 class="text-xl font-semibold">{workout.name}</h3>
					</Card.Title>
				</Card.Header>

				<Card.Content>
					<ul class="mt-4 space-y-4">
						{#each workout.sets as set, setIndex}
							<li class="flex flex-col gap-2">
								<div class="flex items-center gap-4">
									<div>
										<Label for="weight-{setIndex}" class="text-right">Weight (kg)</Label>
										<Input
											id="weight-{setIndex}"
											type="number"
											value={set.weight}
											on:input={(e) =>
												updateWorkoutDetails(
													weekIndex,
													sessionIndex,
													workoutIndex,
													setIndex,
													'weight',
													e.target.value
												)}
										/>
									</div>
									<div>
										<Label for="reps-{setIndex}" class="text-right">Reps</Label>

										<Input
											id="reps-{setIndex}"
											type="number"
											value={set.reps}
											on:input={(e) =>
												updateWorkoutDetails(
													weekIndex,
													sessionIndex,
													workoutIndex,
													setIndex,
													'reps',
													e.target.value
												)}
										/>
									</div>
									<div>
										<Checkbox
											id="completed-{setIndex}"
											class="mt-6"
											bind:checked={set.completed}
											onCheckedChange={(e) =>
												updateWorkoutDetails(
													weekIndex,
													sessionIndex,
													workoutIndex,
													setIndex,
													'completed',
													e
												)}
										/>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				</Card.Content>
				<Card.Footer class="mt-6 flex justify-end">
					<Button on:click={markAsCompleted}>Mark as complete</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
{/if}

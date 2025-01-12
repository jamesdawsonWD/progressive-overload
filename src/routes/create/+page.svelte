<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import {
		availableWorkouts,
		getMuscleGroupName,
		getWorkoutById,
		type Workout,
		muscleGroupList
	} from '$lib/composables/exercises';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let modalOpen = false;
	let selected: {
		sets: number;
		exercise: number | null;
		muscleGroup: number | null;
	} = {
		sets: 3,
		exercise: 1,
		muscleGroup: null
	};

	interface Session {
		workouts: (Workout & { sets: number })[];
	}

	interface Week {
		rir: number;
	}

	interface WorkoutPlan {
		sessions: Session[];
		weeks: Week[];
	}

	let planName = '';
	let workoutPlan: WorkoutPlan = {
		sessions: [],
		weeks: []
	};

	function addWeek(rir: 1) {
		workoutPlan.weeks = [
			...workoutPlan.weeks,
			{
				rir
			}
		];
	}
	function addSession() {
		workoutPlan.sessions = [...workoutPlan.sessions, { workouts: [] }];
	}

	function addWorkout(sessionIndex: number, workoutId: number | null, sets: number) {
		if (!workoutId) {
			throw new Error('Workout not provided');
		}

		const selectedWorkout = getWorkoutById(workoutId);
		if (!selectedWorkout) {
			throw new Error('Exercise does not exist');
		}

		workoutPlan.sessions[sessionIndex].workouts = [
			...workoutPlan.sessions[sessionIndex].workouts,
			{
				...selectedWorkout,
				sets
			}
		];

		selected = {
			sets: 3,
			exercise: null,
			muscleGroup: null
		};

		modalOpen = false;
	}

	const workouts = availableWorkouts.map((workout) => {
		return {
			label: workout.name,
			value: workout.id,
			muscleGroup: workout.muscleGroupId
		};
	});
</script>

<h1 class="mb-16 text-2xl font-bold text-white">Create a Workout Plan</h1>
<div class="mb-6">
	<Label for="plan-name" class="mb-2 block">Plan Name</Label>
	<Input bind:value={planName} id="plan-name" placeholder="Enter plan name" />
</div>

<Button on:click={() => addWeek(1)} class="mb-6">Add week</Button>

<div class="flex gap-4">
	<!-- Display the workout plan structure -->
	{#each workoutPlan.weeks as week, weekIndex}
		<div class="w-[350px] space-y-2 rounded-lg border border-dashed border-border p-4">
			<h2 class="text-xl font-bold">Week {weekIndex + 1}</h2>
			{#each workoutPlan.sessions as session, sessionIndex}
				<Card.Root>
					<Card.Header>
						<Card.Title>Session {sessionIndex + 1}</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="mt-2 text-white">
							{#each session.workouts as workout}
								<li class="flex flex-col gap-2 text-zinc-900">
									<div>
										<Badge class="inline-flex items-center"
											>{getMuscleGroupName(workout.muscleGroupId)}</Badge
										>
									</div>
									<div class="flex gap-2">
										<span>{workout.name}</span>
										<p>x{workout.sets}</p>
									</div>
								</li>
							{/each}
						</ul>
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button variant="outline">Remove</Button>
						<Dialog.Root bind:open={modalOpen}>
							<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
								>Add workout</Dialog.Trigger
							>
							<Dialog.Content class="sm:max-w-[425px]">
								<Dialog.Header>
									<Dialog.Title>Add workout</Dialog.Title>
									<Dialog.Description>Select a workout and the number of sets.</Dialog.Description>
								</Dialog.Header>

								<div class="grid gap-4 py-4">
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="name" class="text-right">Muscle group</Label>

										<Select.Root
											portal={null}
											onSelectedChange={(s) => {
												selected.muscleGroup = s?.value as number;
											}}
										>
											<Select.Trigger class="col-span-3">
												<Select.Value placeholder="Select a muscle group" class="!text-left" />
											</Select.Trigger>
											<Select.Content>
												<Select.Group class="h-80 overflow-y-scroll">
													{#each muscleGroupList as muscleGroup}
														<Select.Item value={muscleGroup.value} label={muscleGroup.label}
															>{muscleGroup.label}</Select.Item
														>
													{/each}
												</Select.Group>
											</Select.Content>
											<Select.Input name="muscleGroup" bind:value={selected.muscleGroup} />
										</Select.Root>
									</div>
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="name" class="text-right">Exercise</Label>

										<Select.Root
											portal={null}
											disabled={!selected.muscleGroup}
											onSelectedChange={(s) => {
												selected.exercise = s?.value as number;
											}}
										>
											<Select.Trigger class="col-span-3">
												<Select.Value placeholder="Select an exercise" />
											</Select.Trigger>
											<Select.Content>
												<Select.Group class="h-80 overflow-y-scroll">
													{#each workouts.filter((w) => w.muscleGroup === selected.muscleGroup) as workout}
														<Select.Item value={workout.value} label={workout.label}
															>{workout.label}</Select.Item
														>
													{/each}
												</Select.Group>
											</Select.Content>
											<Select.Input name="exercise" bind:value={selected.exercise} />
										</Select.Root>
									</div>
									<div class="grid grid-cols-4 items-center gap-4">
										<Label for="sets" class="text-right">Sets</Label>
										<Input
											id="sets"
											type="number"
											disabled={!selected.muscleGroup}
											bind:value={selected.sets}
											class="col-span-3"
										/>
									</div>
								</div>
								<Dialog.Footer>
									<Button
										type="submit"
										on:click={() => addWorkout(sessionIndex, selected.exercise, selected.sets)}
										>Add workout</Button
									>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
					</Card.Footer>
				</Card.Root>
			{/each}
			<Button on:click={addSession}>Add Session</Button>
		</div>
	{/each}
</div>
<Button class="mb-6">Create Plan</Button>

{JSON.stringify(workoutPlan)}

<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import {
		availableWorkouts,
		getMuscleGroupName,
		getWorkoutById,
		type Workout,
		muscleGroupList
	} from '$lib/composables/exercises';
	import type { Session, Week, WorkoutPlan } from './types';
	import { generateUUID } from '$lib/utils';

	let modalOpen = false;
	let selected: {
		sets: number;
		exercise: number | null;
		muscleGroup: number | null;
		week: number | null;
		session: number | null;
	} = {
		sets: 3,
		exercise: 1,
		muscleGroup: null,
		week: null,
		session: null
	};

	let workoutPlan: WorkoutPlan = {
		name: '',
		weeks: [
			{
				sessions: [],
				rir: 1
			}
		]
	};

	function addWeek(rir: 1) {
		workoutPlan.weeks = [
			...workoutPlan.weeks,
			{
				rir,
				sessions: []
			}
		];
	}

	function addSession(weekIndex: number) {
		workoutPlan.weeks[weekIndex].sessions = [
			...workoutPlan.weeks[weekIndex].sessions,
			{ workouts: [] as Workout[], completed: false, id: generateUUID() } as Session
		];
	}

	function saveWorkoutPlan(workoutPlan: WorkoutPlan) {
		try {
			localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
			console.log('Workout plan saved successfully!');
		} catch (error) {
			console.error('Failed to save workout plan:', error);
		}
	}
	function addWorkout(
		weekIndex: number | null,
		sessionIndex: number | null,
		workoutId: number | null,
		sets: number
	) {
		if (weekIndex === null) {
			throw new Error('Week index not provided');
		}

		if (sessionIndex === null) {
			throw new Error('Session index not provided');
		}

		if (!workoutId) {
			throw new Error('Workout not provided');
		}

		const selectedWorkout = getWorkoutById(workoutId);
		if (!selectedWorkout) {
			throw new Error('Exercise does not exist');
		}

		workoutPlan.weeks[weekIndex].sessions[sessionIndex].workouts = [
			...workoutPlan.weeks[weekIndex].sessions[sessionIndex].workouts,
			{
				...selectedWorkout,
				sets
			}
		];

		selected = {
			sets: 3,
			exercise: null,
			muscleGroup: null,
			week: null,
			session: null
		};

		modalOpen = false;
	}

	function handleOpenAddWorkoutModal(week: number, session: number) {
		console.log(week, session);
		selected.week = week;
		selected.session = session;
		modalOpen = true;
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
	<Input bind:value={workoutPlan.name} id="plan-name" placeholder="Enter plan name" />
</div>

<Button on:click={() => addWeek(1)} class="mb-6">Add week</Button>

<div class="flex gap-4">
	<!-- Display the workout plan structure -->
	{#each workoutPlan.weeks as week, weekIndex}
		<div class="w-[350px] space-y-2 rounded-lg border border-dashed border-border p-4">
			<h2 class="text-xl font-bold">Week {weekIndex + 1}</h2>
			{#each week.sessions as session, sessionIndex}
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
						<Button on:click={() => handleOpenAddWorkoutModal(weekIndex, sessionIndex)}
							>Add Workout</Button
						>
					</Card.Footer>
				</Card.Root>
			{/each}
			<Button on:click={() => addSession(weekIndex)}>Add Session</Button>
		</div>
	{/each}
</div>
<Button class="mb-6" on:click={() => saveWorkoutPlan(workoutPlan)}>Create Plan</Button>

<!--Workout modal-->
<Dialog.Root bind:open={modalOpen}>
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
				on:click={() =>
					addWorkout(selected.week, selected.session, selected.exercise, selected.sets)}
				>Add workout</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

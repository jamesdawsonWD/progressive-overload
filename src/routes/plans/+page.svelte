<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WorkoutPlan } from '../create/types';
	import Button from '$lib/components/ui/button/button.svelte';

	let workoutPlans: Record<string, any> = {}; // To store retrieved plans
	let plansArray: Array<any> = []; // To store plans in array format for rendering

	// Function to retrieve workout plans from localStorage
	function getWorkoutPlans() {
		try {
			const storedPlans = localStorage.getItem('plans');
			if (storedPlans) {
				// Parse the stored plans
				workoutPlans = JSON.parse(storedPlans);

				console.log(workoutPlans);
				// Convert the object to an array for easier iteration
				plansArray = Object.entries(workoutPlans).map(([name, plan]) => ({
					name,
					...plan
				}));

				console.log('Updated plansArray:', plansArray);
			} else {
				plansArray = []; // Ensure it's initialized as an empty array
			}
		} catch (error) {
			console.error('Error retrieving plans from localStorage:', error);
			plansArray = []; // Ensure it's an empty array on error
		}
	}

	// Fetch workout plans on page load
	onMount(() => {
		getWorkoutPlans();
	});

	function saveCurrentWorkoutPlan(workoutPlan: WorkoutPlan) {
		try {
			// Save the updated object back to localStorage
			localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));

			console.log('Workout plan saved successfully!');
		} catch (error) {
			console.error('Failed to save workout plan:', error);
		}
	}
</script>

<div>
	<h1>Workout Plans</h1>

	{#if plansArray && plansArray.length > 0}
		<div class="card-container">
			{#each plansArray as plan, index}
				<Card.Root class="card">
					<Card.Header>
						<Card.Title>{plan.name}</Card.Title>
					</Card.Header>

					<Card.Footer class="flex justify-between">
						<Button on:click={() => saveCurrentWorkoutPlan(plan)}>Select Plan</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{:else}
		<p>No workout plans found.</p>
	{/if}
</div>

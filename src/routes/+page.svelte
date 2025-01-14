<script lang="ts">
	import type { WorkoutPlan } from './create/types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { goto } from '$app/navigation';

	function navigateToSession(sessionId: string) {
		console.log(sessionId);
		goto(`/session/${sessionId}`);
	}

	function getWorkoutPlan(): WorkoutPlan | null {
		try {
			const storedPlan = localStorage.getItem('workoutPlan');
			if (storedPlan) {
				return JSON.parse(storedPlan);
			} else {
				console.log('No workout plan found.');
				return null;
			}
		} catch (error) {
			console.error('Failed to retrieve workout plan:', error);
			return null;
		}
	}

	const retrievedPlan = getWorkoutPlan();
</script>

{#if retrievedPlan}
	<h2>{retrievedPlan.name}</h2>
	<div class="flex gap-4">
		{#each retrievedPlan.weeks as week, weekIndex}
			<div class="w-[500px] space-y-2">
				<h2>Week {weekIndex + 1}</h2>
				{#each week.sessions as session, sessionIndex}
					<a href={`/session/${session.id}`} class="no-underline">
						<Card.Root>
							<Card.Header>
								<Card.Title>Session {sessionIndex + 1}</Card.Title>
							</Card.Header>

							<Card.Footer class="flex justify-between">
								<p><strong>Week RIR:</strong> {retrievedPlan.weeks[sessionIndex]?.rir}</p>
							</Card.Footer>
						</Card.Root>
					</a>
				{/each}
			</div>
		{/each}
	</div>
{:else}
	<p>No workout plan found. Please create one.</p>
{/if}

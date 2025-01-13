<script lang="ts">
	import type { WorkoutPlan } from './create/types';
	import * as Card from '$lib/components/ui/card/index.js';

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
	<div class="flex gap-2">
		{#each retrievedPlan.weeks as week, weekIndex}
			<div class="w-[500px]">
				<h2>Week {weekIndex + 1}</h2>
				{#each retrievedPlan.sessions as session, sessionIndex}
					<Card.Root>
						<Card.Header>
							<Card.Title>Session {sessionIndex + 1}</Card.Title>
						</Card.Header>
						<Card.Content>
							<p><strong>Workouts in this session:</strong></p>
							<ul>
								{#each session.workouts as workout, workoutIndex}
									<li>
										<p><strong>Exercise {workoutIndex + 1}: {workout.name}</strong></p>
										<p>Sets: {workout.sets}</p>
										<p>Type: {workout.exerciseType}</p>
										{#if workout.youtubeId}
											<p>
												<a
													href={`https://www.youtube.com/watch?v=${workout.youtubeId}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													Watch on YouTube
												</a>
											</p>
										{/if}
									</li>
								{/each}
							</ul>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<p><strong>Week RIR:</strong> {retrievedPlan.weeks[sessionIndex]?.rir}</p>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		{/each}
	</div>
{:else}
	<p>No workout plan found. Please create one.</p>
{/if}

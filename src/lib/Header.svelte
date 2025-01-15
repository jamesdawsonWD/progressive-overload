<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Close menu on page load for safety
	onMount(() => (isMenuOpen = false));
</script>

<header class="flex w-full items-center justify-between px-6 py-4 md:px-20 md:py-4">
	<!-- Logo -->
	<h1 class="text-primary-600 text-xl font-bold">Progressive Overload</h1>

	<!-- Burger Menu Icon (visible on mobile) -->
	<Button
		class="text-primary-600 focus:outline-none md:hidden"
		on:click={toggleMenu}
		aria-label="Toggle navigation"
	>
		{#if isMenuOpen}
			✕ <!-- Close Icon -->
		{:else}
			☰ <!-- Hamburger Icon -->
		{/if}
	</Button>

	<!-- Navigation Links (Hidden on Mobile by Default) -->
	<nav class="hidden justify-center space-x-4 md:flex">
		<a href="/" class="text-primary-600 hover:text-primary-500">Current Workout</a>
		<a href="/plans" class="text-primary-600 hover:text-primary-500">Workouts</a>
		<Button href="/create">Create</Button>
	</nav>

	<!-- Mobile Dropdown Menu -->
	{#if isMenuOpen}
		<nav
			class="absolute left-0 top-16 z-50 flex w-full flex-col items-center justify-center space-y-4 bg-zinc-900 py-4 md:hidden"
		>
			<a href="/" class="text-primary-600 hover:text-primary-500">Current Workout</a>
			<a href="/plans" class="text-primary-600 hover:text-primary-500">Workouts</a>
			<Button href="/create">Create</Button>
		</nav>
	{/if}
</header>

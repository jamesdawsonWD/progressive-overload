<script lang="ts">
	import { i18n } from '$lib/i18n';
	import Header from '$lib/Header.svelte';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Footer from '$lib/Footer.svelte';
	let { children } = $props();
</script>

<Header />

<ParaglideJS {i18n}>
	<div class="mx-auto my-8 max-w-fit px-4">
		{@render children()}
	</div>
</ParaglideJS>

<Footer />

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
    <header class="p-6 border-b border-purple-700">
      <h1 class="text-3xl font-bold text-center">Digital Dreamscapes</h1>
      <p class="text-center mt-2 text-purple-300">Create, Save, and Share Beautiful Abstract Art</p>
    </header>
    
    <main class="container mx-auto p-4">
      <ArtGenerator />
      <Gallery />
    </main>
    
    <footer class="mt-10 py-4 text-center text-sm text-purple-400 border-t border-purple-700">
      <p>© {{ new Date().getFullYear() }} Digital Dreamscapes. Made with ❤️ by a Full-Stack Developer</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArtGenerator from './components/ArtGenerator.vue';
import Gallery from './components/Gallery.vue';

export default defineComponent({
  name: 'App',
  components: {
    ArtGenerator,
    Gallery
  }
});
</script>

<style>
/* Add your styles here */
</style>

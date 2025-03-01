<template>
  <div class="mt-12">
    <h2 class="text-2xl font-bold mb-6">My Gallery</h2>

    <div v-if="loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-500 bg-opacity-20 p-4 rounded-md text-center"
    >
      Error loading gallery: {{ error.message }}
    </div>

    <div v-else-if="arts.length === 0" class="text-center py-8">
      <p class="text-lg">You haven't saved any artwork yet.</p>
      <p class="mt-2 text-purple-300">
        Create and save some art to see it here!
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="art in arts"
        :key="art.id"
        class="bg-purple-800 bg-opacity-40 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative"
      >
        <!-- Delete button - positioned in corner -->
        <button
          @click="confirmDelete(art)"
          class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
          title="Delete artwork"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <img :src="art.data" alt="Artwork" class="w-full h-48 object-cover" />
        <div class="p-4">
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ art.title || "Untitled" }}</h3>
            <span class="text-xs text-purple-300">{{
              formatDate(art.createdAt)
            }}</span>
          </div>
          <div class="mt-2 text-sm">
            <span class="bg-purple-700 px-2 py-1 rounded text-xs mr-2">{{
              art.palette || "Custom"
            }}</span>
            <span class="bg-purple-700 px-2 py-1 rounded text-xs"
              >Complexity: {{ art.complexity || "?" }}</span
            >
          </div>

          <!-- Download options -->
          <div class="mt-4 flex justify-between">
            <button
              @click="downloadHighQuality(art)"
              class="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
            >
              Download HD
            </button>
            <button
              @click="openInNewTab(art.data)"
              class="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition-colors"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Confirm Deletion</h3>
        <p class="mb-6">
          Are you sure you want to delete this artwork? This action cannot be
          undone.
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            @click="deleteArtwork()"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { eventBus } from "@/utils/eventBus";

// GraphQL query to fetch all saved artworks
const GET_ARTS = gql`
  query GetArts {
    arts {
      id
      data
      title
      palette
      complexity
      createdAt
    }
  }
`;

// GraphQL mutation to delete artwork
const DELETE_ART = gql`
  mutation DeleteArt($id: ID!) {
    deleteArt(id: $id) {
      id
      success
    }
  }
`;

// Fetch artworks using Apollo
const { result, loading, error, refetch } = useQuery(GET_ARTS);

// Setup delete mutation
const { mutate: deleteArtMutation } = useMutation(DELETE_ART);

// Delete confirmation state
const showDeleteModal = ref(false);

// Add a type for the art object
interface ArtItem {
  id: string | number;
  data: string;
  title?: string;
  palette?: string;
  complexity?: number;
  createdAt?: string;
}

// Use proper typing for the ref
const artToDelete = ref<ArtItem | null>(null);

// Extract the arts array from the result
const arts = computed(() => result.value?.arts || []);

// Function to open image in new tab
const openInNewTab = (dataUrl: string) => {
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Artwork Preview</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              background-color: #1f1f1f;
              min-height: 100vh;
            }
            img { 
              max-width: 95%; 
              max-height: 95vh; 
              object-fit: contain; 
              box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Artwork" />
        </body>
      </html>
    `);
    newWindow.document.close();
  }
};

// Function to download artwork in high quality
const downloadHighQuality = (art: any) => {
  try {
    // Create a new Image element to work with
    const img = new Image();

    // When image loads, create a high-quality version
    img.onload = () => {
      // Create a canvas element with the image's dimensions
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw the image on the canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Get high-quality PNG data (lossless)
        const highQualityData = canvas.toDataURL("image/png", 1.0);

        // Create download link with the high-quality data
        const link = document.createElement("a");
        link.href = highQualityData;
        link.download = art.title || `Artwork-${art.id}.png`;

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    // Set the image source to start loading
    img.src = art.data;
  } catch (err) {
    console.error("Error generating high-quality download:", err);
    alert("Failed to create download. Please try again.");
  }
};

// Show confirmation dialog
const confirmDelete = (art: any) => {
  artToDelete.value = art;
  showDeleteModal.value = true;
};

// Delete artwork
const deleteArtwork = async () => {
  if (!artToDelete.value) return;

  try {
    await deleteArtMutation({ id: artToDelete.value.id });

    // Close modal
    showDeleteModal.value = false;

    // Refresh the gallery
    await refetch();
  } catch (err) {
    console.error("Error deleting artwork:", err);
    alert("Failed to delete artwork. Please try again.");
  } finally {
    artToDelete.value = null;
  }
};

// Format date for display with better debugging
const formatDate = (dateString: string) => {
  if (!dateString) return "";

  try {
    console.log("Raw date string:", dateString);

    // Check if it's a Unix timestamp (number or string)
    const timestamp = parseInt(dateString);
    let date;

    if (!isNaN(timestamp)) {
      // Handle timestamp (seconds or milliseconds)
      date = new Date(timestamp > 999999999999 ? timestamp : timestamp * 1000);
    } else {
      // Handle ISO or other string formats
      date = new Date(dateString);
    }

    // Debug log the parsed date
    console.log("Parsed date object:", date);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try other formats or return placeholder
      return "Recent";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (err) {
    console.error("Date formatting error for input:", dateString, err);
    return "Recent";
  }
};

// Set up event listener when component is mounted
onMounted(() => {
  // Listen for artwork-saved events and refresh gallery
  eventBus.on("artwork-saved", handleArtworkSaved);
});

// Clean up event listener when component is unmounted
onUnmounted(() => {
  eventBus.off("artwork-saved", handleArtworkSaved);
});

// Handler function to refresh gallery data
const handleArtworkSaved = async () => {
  console.log("New artwork saved - refreshing gallery");
  await refetch();
};
</script>

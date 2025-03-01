<template>
  <div class="flex flex-col md:flex-row gap-8 mt-6">
    <!-- Controls Panel -->
    <div
      class="w-full md:w-1/3 bg-purple-800 bg-opacity-50 p-6 rounded-lg shadow-lg"
    >
      <h2 class="text-xl font-bold mb-4">Art Controls</h2>

      <!-- Color Selection -->
      <div class="mb-6">
        <label class="block mb-2 font-medium">Color Palette</label>
        <select
          v-model="selectedPalette"
          class="w-full p-2 bg-purple-900 text-white rounded border border-purple-600 focus:ring-2 focus:ring-purple-500"
        >
          <option
            v-for="palette in colorPalettes"
            :key="palette.name"
            :value="palette.name"
          >
            {{ palette.name }}
          </option>
        </select>

        <div class="flex mt-2 gap-2">
          <div
            v-for="color in getPaletteColors()"
            :key="color"
            :style="{ backgroundColor: color }"
            class="w-6 h-6 rounded-full"
          ></div>
        </div>
      </div>

      <!-- Shape Controls -->
      <div class="mb-6">
        <label class="block mb-2 font-medium">Shape Selection</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="shape in shapes"
            :key="shape"
            @click="selectedShape = shape"
            :class="[
              'px-3 py-2 border rounded-md transition-colors',
              selectedShape === shape
                ? 'bg-purple-600 border-purple-400'
                : 'bg-purple-900 border-purple-700 hover:bg-purple-700',
            ]"
          >
            {{ shape }}
          </button>
        </div>
      </div>

      <!-- Complexity Slider -->
      <div class="mb-6">
        <label class="block mb-2 font-medium">
          Complexity: {{ complexity }}
        </label>
        <input
          type="range"
          v-model="complexity"
          min="5"
          max="30"
          class="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <!-- Randomness Slider -->
      <div class="mb-6">
        <label class="block mb-2 font-medium">
          Randomness: {{ randomness }}%
        </label>
        <input
          type="range"
          v-model="randomness"
          min="10"
          max="100"
          class="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3">
        <button
          @click="generateArt"
          class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-md font-medium transition-colors"
        >
          <span v-if="!isGenerating">Generate New Art</span>
          <span v-else>Generating...</span>
        </button>

        <button
          @click="saveArt"
          :disabled="isSaving"
          class="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          <span v-if="!isSaving">Save Artwork</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </div>

    <!-- Canvas Area -->
    <div class="w-full md:w-2/3">
      <div class="bg-white p-2 rounded-lg shadow-lg">
        <div
          ref="canvasContainer"
          class="w-full h-[600px] overflow-hidden relative"
        >
          <!-- Loading overlay -->
          <div
            v-if="isGenerating"
            class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          >
            <div
              class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"
            ></div>
          </div>
        </div>
      </div>

      <!-- Success message -->
      <div
        v-if="showSuccessMessage"
        class="mt-4 p-4 bg-green-500 bg-opacity-20 rounded-md"
      >
        <p class="text-green-300">Artwork saved successfully!</p>
      </div>

      <!-- Error message -->
      <div
        v-if="errorMessage"
        class="mt-4 p-4 bg-red-500 bg-opacity-20 rounded-md"
      >
        <p class="text-red-300">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { DocumentNode } from "graphql";
import p5 from "p5";
import { ApolloError } from "@apollo/client/core";
import { eventBus } from "@/utils/eventBus";

// Define GraphQL mutation as a typed DocumentNode
const SAVE_ART_MUTATION: DocumentNode = gql`
  mutation SaveArtwork(
    $data: String!
    $title: String
    $palette: String
    $complexity: Int
  ) {
    saveArt(
      data: $data
      title: $title
      palette: $palette
      complexity: $complexity
    ) {
      id
      title
    }
  }
`;

// UI state
const isGenerating = ref(false);
const isSaving = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref("");

// Canvas references
const canvasContainer = ref(null);
let p5Instance: any = null;

// Art configuration
const selectedPalette = ref("Ocean Breeze");
const selectedShape = ref("Mixed");
const complexity = ref(15);
const randomness = ref(60);

// Color palettes
const colorPalettes = [
  {
    name: "Ocean Breeze",
    colors: ["#1a535c", "#4ecdc4", "#f7fff7", "#ff6b6b", "#ffe66d"],
  },
  {
    name: "Sunset Glow",
    colors: ["#ff9e00", "#ff0000", "#272727", "#ffffff", "#f4f4f4"],
  },
  {
    name: "Forest Dream",
    colors: ["#004b23", "#006400", "#007200", "#008000", "#38b000"],
  },
  {
    name: "Neon Night",
    colors: ["#2b2d42", "#8d99ae", "#edf2f4", "#ef233c", "#d90429"],
  },
  {
    name: "Pastel Dream",
    colors: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"],
  },
  {
    name: "Monochrome",
    colors: ["#000000", "#1a1a1a", "#4d4d4d", "#cccccc", "#ffffff"],
  },
];

// Available shapes
const shapes = ["Mixed", "Circle", "Square", "Triangle"];

// GraphQL mutation
const {
  mutate: saveArtMutation,
  onError,
  onDone,
} = useMutation(SAVE_ART_MUTATION);

// Get colors for the currently selected palette
const getPaletteColors = () => {
  const palette = colorPalettes.find((p) => p.name === selectedPalette.value);
  return palette ? palette.colors : [];
};

// Generate new art with the current settings
const generateArt = async () => {
  isGenerating.value = true;
  errorMessage.value = "";

  // Remove previous canvas if it exists
  if (p5Instance) {
    p5Instance.remove();
  }

  // Create new p5 instance
  p5Instance = new p5((p) => {
    let scaleFactor = 1;

    p.setup = () => {
      // Create a high-resolution canvas that maintains aspect ratio
      if (canvasContainer.value) {
        const container = canvasContainer.value as HTMLElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Calculate aspect ratio and set minimum dimensions of 1920x1080
        const aspectRatio = containerWidth / containerHeight;
        let canvasWidth, canvasHeight;

        if (aspectRatio >= 16 / 9) {
          // Wider than 16:9, use height as reference
          canvasHeight = Math.max(1080, containerHeight);
          canvasWidth = canvasHeight * aspectRatio;
        } else {
          // Taller than 16:9, use width as reference
          canvasWidth = Math.max(1920, containerWidth);
          canvasHeight = canvasWidth / aspectRatio;
        }

        // Calculate scale factor (ratio of high-res to display size)
        scaleFactor = Math.max(
          canvasWidth / containerWidth,
          canvasHeight / containerHeight
        );

        // Create high-resolution canvas
        p.createCanvas(canvasWidth, canvasHeight);

        // Scale the display to fit container while keeping high resolution
        const canvas = document.querySelector("canvas");
        if (canvas) {
          canvas.style.width = "100%";
          canvas.style.height = "100%";
        }
      } else {
        // Fallback to 1920x1080 if container not available
        p.createCanvas(1920, 1080);
        scaleFactor = 3.2; // Default scale factor for 1920x1080
      }
      p.noLoop();
    };

    p.draw = () => {
      // Set white background
      p.background(255);

      // Get palette colors
      const paletteColors = getPaletteColors();

      // Fix: Normalize randomness to prevent issues at 100%
      // This ensures that even at 100%, we still get variation in the art
      const normalizedRandomness = Math.min(randomness.value, 99) / 100;

      // Number of shapes to draw based on complexity
      const shapesCount = complexity.value * 5;

      // Draw shapes
      for (let i = 0; i < shapesCount; i++) {
        // Choose a random color from the palette - using normalized randomness
        const colorIndex = Math.floor(p.random(paletteColors.length));
        p.fill(paletteColors[colorIndex]);

        // Randomize opacity based on randomness
        const opacity = p.map(
          p.random(),
          0,
          1,
          0.1,
          0.8 * (1 - normalizedRandomness * 0.5)
        );
        p.fill(
          p.color(
            p.red(p.color(paletteColors[colorIndex])),
            p.green(p.color(paletteColors[colorIndex])),
            p.blue(p.color(paletteColors[colorIndex])),
            opacity * 255
          )
        );

        // Randomly decide to have stroke or not
        if (p.random() > normalizedRandomness) {
          p.stroke(0, 20);
        } else {
          p.noStroke();
        }

        // Position with controlled randomness
        const x = p.random(p.width);
        const y = p.random(p.height);

        // Size with controlled randomness
        // Fix: Ensure minimum size even at high randomness
        const baseSize = p.random(10, 100);
        const randomFactor = p.map(normalizedRandomness, 0, 1, 0.8, 0.2);
        const size =
          baseSize * (randomFactor + p.random() * (1 - randomFactor));

        // Draw shape based on selection or random if "Mixed"
        const shapeType =
          selectedShape.value === "Mixed"
            ? shapes[Math.floor(p.random(1, shapes.length))]
            : selectedShape.value;

        const scaledSize = size * scaleFactor;

        if (shapeType === "Circle") {
          p.ellipse(x, y, scaledSize, scaledSize);
        } else if (shapeType === "Square") {
          p.rect(
            x - scaledSize / 2,
            y - scaledSize / 2,
            scaledSize,
            scaledSize
          );
        } else if (shapeType === "Triangle") {
          p.triangle(
            x,
            y - scaledSize / 2,
            x - scaledSize / 2,
            y + scaledSize / 2,
            x + scaledSize / 2,
            y + scaledSize / 2
          );
        }
      }

      isGenerating.value = false;
    };
  }, canvasContainer.value || undefined);
};

// Save the current artwork
const saveArt = async () => {
  if (!p5Instance) {
    errorMessage.value = "No artwork to save. Please generate one first.";
    return;
  }

  try {
    isSaving.value = true;
    errorMessage.value = "";

    // Get canvas and extract data
    const canvas = document.querySelector("canvas");
    if (!canvas) throw new Error("Canvas not found");

    // For storage: create a compressed version (JPEG with medium quality)
    const compressedImageData = canvas.toDataURL("image/jpeg", 0.5);

    // For download: keep the original high quality PNG
    // We'll store this in localStorage for the current session
    const highQualityData = canvas.toDataURL("image/png");
    try {
      localStorage.setItem(`lastArtworkHQ`, highQualityData);
    } catch (e) {
      console.warn("Could not save high-quality version to localStorage", e);
    }

    // Pass variables explicitly as object
    const mutationVariables = {
      data: compressedImageData, // Send the compressed version
      title: `Artwork-${new Date().toISOString().slice(0, 10)}`,
      palette: selectedPalette.value,
      complexity: Number(complexity.value),
    };

    console.log("Sending mutation with variables:");
    console.log(
      JSON.stringify(
        {
          ...mutationVariables,
          data: `[data of length: ${mutationVariables.data.length}]`,
        },
        null,
        2
      )
    );

    // Use direct format recognized by Apollo
    const result = await saveArtMutation(mutationVariables);

    showSuccessMessage.value = true;
    setTimeout(() => (showSuccessMessage.value = false), 5000);

    // Emit event to notify Gallery component
    eventBus.emit("artwork-saved");
  } catch (err) {
    console.error("Error saving artwork:", err);
    errorMessage.value =
      "Failed to save: " +
      (err instanceof Error ? err.message : "Unknown error");
  } finally {
    isSaving.value = false;
  }
};

// Watch for configuration changes to regenerate art
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  [selectedPalette, selectedShape, complexity, randomness],
  () => {
    // Debounce to avoid excessive regeneration
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      generateArt();
    }, 800);
  },
  { deep: true }
);

// Handle errors and success from mutation
onError((error: ApolloError) => {
  console.error("GraphQL Error:", error);
  errorMessage.value = "Server error: " + (error.message || "Unknown error");
  isSaving.value = false;
});

onDone(() => {
  console.log("Save operation completed");
});

// Generate initial artwork on mount
onMounted(() => {
  generateArt();
});
</script>

<style>
/* Add any additional styles here */
</style>

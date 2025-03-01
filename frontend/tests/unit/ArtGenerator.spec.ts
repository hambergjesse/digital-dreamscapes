/// <reference types="jest" />
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick, ComponentPublicInstance } from "vue";
import ArtGenerator from "../../src/components/ArtGenerator.vue";

// Define P5 instance type based on our mock
interface P5Instance {
  remove: jest.Mock;
  createCanvas: jest.Mock;
  background: jest.Mock;
  setup: jest.Mock;
  draw: jest.Mock;
  random: jest.Mock;
  fill: jest.Mock;
  stroke: jest.Mock;
  noStroke: jest.Mock;
  ellipse: jest.Mock;
  rect: jest.Mock;
  triangle: jest.Mock;
  noLoop: jest.Mock;
}

// Define the interface for component properties
interface ArtGeneratorInstance extends ComponentPublicInstance {
  selectedPalette: string;
  selectedShape: string;
  complexity: number;
  randomness: number;
  p5Instance: P5Instance | null;
  errorMessage: string;
}

// Mock p5 to avoid actual canvas creation in tests
jest.mock("p5", () => {
  return jest.fn().mockImplementation(() => ({
    remove: jest.fn(),
    createCanvas: jest.fn(),
    background: jest.fn(),
    setup: jest.fn(),
    draw: jest.fn(),
    random: jest.fn().mockReturnValue(50),
    fill: jest.fn(),
    stroke: jest.fn(),
    noStroke: jest.fn(),
    ellipse: jest.fn(),
    rect: jest.fn(),
    triangle: jest.fn(),
    noLoop: jest.fn(),
  }));
});

// Mock Apollo
jest.mock("@vue/apollo-composable", () => ({
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn().mockResolvedValue({}),
    onError: jest.fn(),
    onDone: jest.fn(),
  }),
}));

describe("ArtGenerator.vue", () => {
  let wrapper: VueWrapper<ArtGeneratorInstance>;

  beforeEach(() => {
    wrapper = mount(ArtGenerator) as VueWrapper<ArtGeneratorInstance>;
  });

  it("renders the component correctly", () => {
    expect(wrapper.find("h2").text()).toBe("Art Controls");
  });

  it("has the correct default values", () => {
    expect(wrapper.vm.selectedPalette).toBe("Ocean Breeze");
    expect(wrapper.vm.selectedShape).toBe("Mixed");
    expect(wrapper.vm.complexity).toBe(15);
    expect(wrapper.vm.randomness).toBe(60);
  });

  it("changes the palette when selected", async () => {
    // Find the palette select dropdown and change its value
    const select = wrapper.find("select");
    await select.setValue("Sunset Glow");

    expect(wrapper.vm.selectedPalette).toBe("Sunset Glow");

    // Wait for the debounce timer
    jest.advanceTimersByTime(800);
    await nextTick();
  });

  it("changes the shape when a shape button is clicked", async () => {
    // Find the Circle shape button and click it
    const buttons = wrapper.findAll("button");
    const circleButton = buttons.find((b) => b.text() === "Circle");

    expect(circleButton).toBeTruthy();
    if (circleButton) {
      await circleButton.trigger("click");
      expect(wrapper.vm.selectedShape).toBe("Circle");
    }
  });

  it("shows an error message when trying to save without generating", async () => {
    // Artificially set p5Instance to null to simulate no artwork
    wrapper.vm.p5Instance = null;

    // Click the save button
    const saveButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Save"));

    expect(saveButton).toBeTruthy();
    if (saveButton) {
      await saveButton.trigger("click");
      // Check if error message is displayed
      expect(wrapper.vm.errorMessage).toContain("No artwork to save");
    }
  });
});

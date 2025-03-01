// Create a simple event bus for component communication
import mitt from "mitt";

// Types for our events
type Events = {
  "artwork-saved": void;
};

// Create and export the event emitter
export const eventBus = mitt<Events>();

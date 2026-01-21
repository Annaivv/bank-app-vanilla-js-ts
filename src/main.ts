import { setupEventListeners } from "./events/listeners";

import { syncStateWithStorage } from "./services/state";

const init = (): void => {
  syncStateWithStorage();
  setupEventListeners();
};

init();

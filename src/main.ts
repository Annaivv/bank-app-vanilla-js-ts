import { setupEventListeners } from "./events/listeners";

import { syncStateWithStorage } from "./services/state";

(function init(): void {
  syncStateWithStorage();
  setupEventListeners();
})();

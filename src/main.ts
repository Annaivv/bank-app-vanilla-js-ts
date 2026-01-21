import { displayMovements } from "./components/render";
import { buttonsUI } from "./constants/selectors";
import { setupEventListeners } from "./events/listeners";
import { showToast } from "./services/notification";
import { syncStateWithStorage } from "./services/state";
import type { Account } from "./types";

let currentAccount: Account | undefined;

const init = (): void => {
  syncStateWithStorage();
  setupEventListeners();
};

init();

// Sort transactions
let sorted = false;
buttonsUI.sort.addEventListener("click", function (e) {
  e.preventDefault();
  if (currentAccount) displayMovements(currentAccount, !sorted);
  sorted = !sorted;

  // Show notification when sorted
  if (sorted) showToast("Movements sorted by amount", "info");

  // Reset timer
  // handleTimer();
});

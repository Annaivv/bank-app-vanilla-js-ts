import {
  closeSignupModal,
  displayMovements,
  openSignupModal,
  updateTimerLabel,
  updateUI,
} from "./components/render";
import {
  buttonsUI,
  containersUI,
  inputsUI,
  labelsUI,
} from "./constants/selectors";
import { handleLogin, handleSignupSubmit } from "./controllers/authController";
import {
  handleSuccess,
  handleTransferError,
  showToast,
} from "./services/notification";
import { setCurrentAccount } from "./services/state";
import { getAccountsData, setAccountsData } from "./services/storage";
import {
  handleLoanRequest,
  handleTransfer,
} from "./services/transactionService";
import type { Account } from "./types";

let currentAccount: Account | undefined;
let logoutTimer: number | undefined;
const accounts: Account[] = getAccountsData();

// Logout timer
export const handleTimer = (): void => {
  if (logoutTimer) clearInterval(logoutTimer);

  let time = 300;
  updateTimerLabel(time);

  logoutTimer = setInterval(() => {
    time--;
    updateTimerLabel(time);

    if (time <= 10 && time > 0)
      showToast(`You will be logged out in ${time} seconds`, "warning", 10000);

    if (time === 0) {
      clearInterval(logoutTimer);
      labelsUI.welcome.textContent = "Log in to get started";
      containersUI.app.classList.remove("visible");
      setCurrentAccount(undefined);

      showToast("Session expired. Please log in again.", "info");
    }
  }, 1000);
};

// Log in
buttonsUI.login.addEventListener("click", function (e) {
  e.preventDefault();
  handleLogin();
});

// Transfer money to other user
buttonsUI.transfer.addEventListener("click", function (e) {
  e.preventDefault();
  handleTransfer();
});

// Request a loan
buttonsUI.loan.addEventListener("click", function (e) {
  e.preventDefault();
  handleLoanRequest();
});

// Close an account
buttonsUI.close.addEventListener("click", function (e) {
  e.preventDefault();

  // Error checks
  if (!currentAccount) return;

  if (inputsUI.closeUsername.value !== currentAccount.username)
    return showToast("Invalid user initials", "error");

  if (+inputsUI.closePin.value !== currentAccount.pin)
    return showToast("Invalid PIN", "error");

  // SUCCESS case
  const index = accounts.findIndex(
    (acc) => acc.username === currentAccount?.username
  );

  // Delete account
  accounts.splice(index, 1);
  setAccountsData(accounts);
  currentAccount = undefined;
  handleSuccess("closeAcc");

  // Hide UI
  containersUI.app.classList.remove("app--visible");
  labelsUI.welcome.textContent = "Log in to get started";

  inputsUI.closeUsername.value = inputsUI.closePin.value = "";
});

// Sort transactions
let sorted = false;
buttonsUI.sort.addEventListener("click", function (e) {
  e.preventDefault();
  if (currentAccount) displayMovements(currentAccount, !sorted);
  sorted = !sorted;

  // Show notification when sorted
  if (sorted) showToast("Movements sorted by amount", "info");

  // Reset timer
  handleTimer();
});

// Open signup modal
buttonsUI.signupOpenForm?.addEventListener("click", openSignupModal);

// Close signup modal on ESC
document.addEventListener("keydown", function (e: KeyboardEvent) {
  if (e.key === "Escape" && !containersUI.modal?.classList.contains("hidden"))
    closeSignupModal();
});

// Close signup modal on overlay click
containersUI.overlay?.addEventListener("click", closeSignupModal);

// Send signup form
buttonsUI.signupSubmitForm?.addEventListener("click", handleSignupSubmit);

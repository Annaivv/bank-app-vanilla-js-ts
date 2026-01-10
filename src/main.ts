import {
  displayMovements,
  updateTimerLabel,
  updateUI,
} from "./components/render";
import {
  buttonsUI,
  containersUI,
  inputsUI,
  labelsUI,
} from "./constants/selectors";
import {
  handleSuccess,
  handleTransferError,
  showToast,
} from "./services/notification";
import { getAccountsData, setAccountsData } from "./services/storage";
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

    if (time === 0) {
      clearInterval(logoutTimer);
      labelsUI.welcome.textContent = "Log in to get started";
      containersUI.app.classList.remove("app--visible");
    }
  }, 1000);
};

// Log in
buttonsUI.login.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputsUI.loginUsername.value
  );

  if (currentAccount?.pin === +inputsUI.loginPin.value) {
    // Display UI and message
    const firstName = currentAccount.owner.split(" ")[0];

    labelsUI.welcome.textContent = `Welcome back, ${firstName}`;
    handleSuccess("login", { name: firstName });
    containersUI.app.classList.add("app--visible");

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    labelsUI.date.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      timeOptions
    ).format(new Date());

    // Clear input fields
    inputsUI.loginUsername.value = inputsUI.loginPin.value = "";
    inputsUI.loginPin.blur();

    // Start logout timer
    handleTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer money to other user
buttonsUI.transfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputsUI.transferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputsUI.transferTo.value
  );

  inputsUI.transferAmount.value = inputsUI.transferTo.value = "";

  if (!currentAccount) return;
  if (
    !receiverAcc ||
    amount < 0 ||
    (currentAccount.balance ?? 0) <= amount ||
    receiverAcc.username === currentAccount.username
  ) {
    handleTransferError({
      totalSum: currentAccount.balance,
      userTo: receiverAcc?.username,
      currentUser: currentAccount.username,
      transferAmount: amount,
    });
    return;
  }

  // Completing transfer
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);

  // Add transfer date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());

  // Update UI
  updateUI(currentAccount);

  // Show toast
  handleSuccess("transfer", {
    name: receiverAcc?.owner,
    amount,
    currency: currentAccount.currency,
  });

  // Save data to storage
  setAccountsData(accounts);

  // Reset timer
  handleTimer();
});

// Request a loan
buttonsUI.loan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputsUI.loanAmount.value);

  if (amount < 0)
    return showToast("Loan amount value should be more than 0", "error");

  if (currentAccount?.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(() => {
      if (currentAccount) {
        // Add movement
        currentAccount.movements.push(amount);

        // Add loan date
        currentAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);

        // Show toast
        handleSuccess("loan", { amount, currency: currentAccount.currency });

        // Save data to storage
        setAccountsData(accounts);

        // Reset timer
        handleTimer();
      }
    }, 3000);
  }
  inputsUI.loanAmount.value = "";
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

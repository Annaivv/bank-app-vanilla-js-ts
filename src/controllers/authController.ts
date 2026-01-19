import { closeSignupModal, updateUI } from "../components/render";
import { containersUI, inputsUI, labelsUI } from "../constants/selectors";
import { handleTimer } from "../main";
import { handleSuccess, showToast } from "../services/notification";
import {
  accounts,
  getCurrentAccount,
  setCurrentAccount,
} from "../services/state";
import { addUser } from "../services/userService";
import type { Account } from "../types";

let isSignup: boolean = false;

export function handleSignupSubmit(e: Event) {
  e.preventDefault();
  isSignup = true;

  if (
    !inputsUI.signupUsername ||
    !inputsUI.signupPin ||
    !inputsUI.signupConfirmPin
  )
    return;

  const fullName = inputsUI.signupUsername.value.trim();
  const pin = inputsUI.signupPin.value.trim();
  const confirmPin = inputsUI.signupConfirmPin.value.trim();

  if (!fullName || !pin || !confirmPin) {
    return showToast("Please fill all form fields!", "error");
  }

  if (pin !== confirmPin) {
    showToast(
      "PINs do not match. Please ensure both entries are identical.",
      "error"
    );

    inputsUI.signupPin.value = inputsUI.signupConfirmPin.value = "";
    inputsUI.signupPin.focus();
    return;
  }

  if (pin.length !== 4 || confirmPin.length !== 4) {
    return showToast("PIN should contain 4 digits", "error");
  }

  if (
    accounts.some(
      (account) => account.owner.toLowerCase() === fullName.toLowerCase()
    )
  )
    return showToast(
      "The user with this full name already exists, please provide another full name",
      "error"
    );

  const curAcc = addUser(fullName, +pin);
  setCurrentAccount(curAcc);

  inputsUI.signupUsername.value =
    inputsUI.signupPin.value =
    inputsUI.signupConfirmPin.value =
      "";

  closeSignupModal();
  handleLogin(e);
}

// Login function
export function handleLogin(e: Event) {
  e.preventDefault();
  // Get current account
  const currentAccount = isSignup
    ? getCurrentAccount()
    : accounts.find(
        (account) =>
          account.username === inputsUI.loginUsername.value.trim().toLowerCase()
      );

  if (!currentAccount) return showToast("User does not exist", "error");

  if (!isSignup && currentAccount.pin !== +inputsUI.loginPin.value)
    return showToast("Wrong PIN provided", "error");

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

  // Handle timer
  handleTimer();
  // Update UI
  updateUI(currentAccount);

  if (!isSignup) {
    // Clear input fields
    inputsUI.loginUsername.value = inputsUI.loginPin.value = "";
    inputsUI.loginPin.blur();
  }
}

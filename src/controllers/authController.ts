import { closeSignupModal, updateUI } from "../components/render";
import { containersUI, inputsUI, labelsUI } from "../constants/selectors";
import { handleTimer } from "../main";
import { handleSuccess, showToast } from "../services/notification";
import { getCurrentAccount, setCurrentAccount } from "../services/state";
import { addUser } from "../services/userService";

export function handleSignupSubmit(e: Event) {
  e.preventDefault();
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

  const curAcc = addUser(fullName, +pin);
  setCurrentAccount(curAcc);
  // console.log(curAcc);

  inputsUI.signupUsername.value =
    inputsUI.signupPin.value =
    inputsUI.signupConfirmPin.value =
      "";

  closeSignupModal();
  handleLogin();
}

// Login function
export function handleLogin() {
  // Get current account
  const currentAccount = getCurrentAccount();

  if (!currentAccount) return showToast("User does not exist", "error");

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
}

// function (e) {
//   e.preventDefault();
//   currentAccount = accounts.find(
//     (acc) => acc.username === inputsUI.loginUsername.value
//   );

//   // console.log(accounts);
//   console.log(currentAccount);

//   if (currentAccount?.pin === +inputsUI.loginPin.value) {
//     // Display UI and message
//     const firstName = currentAccount.owner.split(" ")[0];

//     labelsUI.welcome.textContent = `Welcome back, ${firstName}`;
//     handleSuccess("login", { name: firstName });
//     containersUI.app.classList.add("app--visible");

//     const timeOptions: Intl.DateTimeFormatOptions = {
//       hour: "numeric",
//       minute: "numeric",
//       day: "numeric",
//       month: "numeric",
//       year: "numeric",
//     };

//     labelsUI.date.textContent = new Intl.DateTimeFormat(
//       currentAccount.locale,
//       timeOptions
//     ).format(new Date());

//     // Clear input fields
//     inputsUI.loginUsername.value = inputsUI.loginPin.value = "";
//     inputsUI.loginPin.blur();

//     // Start logout timer
//     handleTimer();

//     // Update UI
//     updateUI(currentAccount);
//   }
// }

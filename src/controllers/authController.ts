import { closeSignupModal } from "../components/render";
import { inputsUI } from "../constants/selectors";
import { showToast } from "../services/notification";
import { addUser } from "../services/userService";

export const handleSignupSubmit = (e: Event) => {
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

  addUser(fullName, +pin);
  inputsUI.signupUsername.value =
    inputsUI.signupPin.value =
    inputsUI.signupConfirmPin.value =
      "";

  closeSignupModal();
};

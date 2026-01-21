import { containersUI, inputsUI, labelsUI } from "../constants/selectors";
import { handleSuccess, showToast } from "./notification";
import { accounts, getCurrentAccount } from "./state";
import { setAccountsData } from "./storage";

export function handleAccountClose(): void {
  let currentAcc = getCurrentAccount();

  // Error checks
  if (!currentAcc) return;

  if (
    inputsUI.closeUsername.value.trim() !== currentAcc.username ||
    +inputsUI.closePin.value.trim() !== currentAcc.pin
  )
    return showToast("Invalid user credentials", "error");

  // Success case
  const index = accounts.findIndex(
    (acc) => acc.username === currentAcc?.username
  );

  // Delete account
  accounts.splice(index, 1);
  setAccountsData(accounts);
  currentAcc = undefined;
  handleSuccess("closeAcc");

  // Hide UI
  containersUI.app.classList.remove("visible");
  labelsUI.welcome.textContent = "Log in to get started";

  inputsUI.closeUsername.value = inputsUI.closePin.value = "";
}

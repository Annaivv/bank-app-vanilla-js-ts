import { updateUI } from "./components/render";
import {
  buttonsUI,
  containersUI,
  inputsUI,
  labelsUI,
} from "./constants/selectors";
import { accounts } from "./data/accounts";
import type { Account } from "./types";

let currentAccount: Account | undefined;
// let timer: number;

// Log in
buttonsUI.login.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputsUI.loginUsername.value
  );

  if (currentAccount?.pin === +inputsUI.loginPin.value) {
    // Display UI and message
    labelsUI.welcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
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

    // // Start logout timer
    // if (timer) clearInterval(timer);
    // timer = startLogOutTimer();

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

  if (!currentAccount) console.log("No current account");

  if (
    currentAccount &&
    amount > 0 &&
    receiverAcc &&
    (currentAccount.balance ?? 0) >= amount &&
    receiverAcc.username !== currentAccount?.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    console.log(currentAccount.movements);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    // clearInterval(timer);
    // timer = startLogOutTimer();
  }
});

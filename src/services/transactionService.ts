import { updateUI } from "../components/render";
import { inputsUI } from "../constants/selectors";
import { handleTimer } from "../main";
import type { Account } from "../types";
import { handleSuccess, handleTransferError, showToast } from "./notification";
import { accounts, getCurrentAccount, refreshAccounts } from "./state";
import { setAccountsData } from "./storage";

export function handleTransfer(): void {
  const currentAcc: Account | undefined = getCurrentAccount();
  const amount: number = +inputsUI.transferAmount.value;
  const receiverAcc: Account | undefined = accounts.find(
    (acc) => acc.username === inputsUI.transferTo.value
  );

  inputsUI.transferAmount.value = inputsUI.transferTo.value = "";

  if (!currentAcc) return;

  if (
    !receiverAcc ||
    amount < 0 ||
    (currentAcc.balance ?? 0) <= amount ||
    receiverAcc.username === currentAcc.username
  ) {
    handleTransferError({
      totalSum: currentAcc.balance,
      userTo: receiverAcc?.username,
      currentUser: currentAcc.username,
      transferAmount: amount,
    });
    return;
  }

  // Completing transfer
  currentAcc.movements.push(-amount);
  receiverAcc.movements.push(amount);

  // Add transfer date
  currentAcc.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());

  // Show toast
  handleSuccess("transfer", {
    name: receiverAcc?.owner,
    amount,
    currency: currentAcc.currency,
  });

  // Save data to storage
  setAccountsData(accounts);

  // Update UI
  updateUI(currentAcc);

  // Reset timer
  handleTimer();
}

export function handleLoanRequest() {
  const currentAcc: Account | undefined = getCurrentAccount();
  const amount: number = Math.floor(+inputsUI.loanAmount.value);

  if (!currentAcc) return;

  if (amount < 0)
    return showToast("Loan amount value should be more than 0", "error");

  if (currentAcc.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAcc.movements.push(amount);
      // Add loan date
      currentAcc.movementsDates.push(new Date().toISOString());

      // Save data to storage
      setAccountsData(accounts);
      refreshAccounts();

      // Show toast
      handleSuccess("loan", { amount, currency: currentAcc.currency });

      // Update UI
      updateUI(currentAcc);

      // Reset timer
      handleTimer();
    }, 3000);
  } else {
    showToast("Loan denied: Insufficient deposit history.", "error");
  }
  inputsUI.loanAmount.value = "";
}

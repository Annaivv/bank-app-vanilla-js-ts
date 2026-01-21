import { updateUI } from "../components/render";
import { inputsUI } from "../constants/selectors";
import { handleTimer } from "../main";
import type { Account } from "../types";
import { handleSuccess, handleTransferError } from "./notification";
import { accounts, getCurrentAccount } from "./state";
import { setAccountsData } from "./storage";

export function handleTransfer() {
  const amount: number = +inputsUI.transferAmount.value;
  const receiverAcc: Account | undefined = accounts.find(
    (acc) => acc.username === inputsUI.transferTo.value
  );
  const currentAcc: Account | undefined = getCurrentAccount();

  inputsUI.transferAmount.value = inputsUI.transferTo.value = "";

  if (!currentAcc) return;

  if (
    !receiverAcc ||
    amount < 0 ||
    (currentAcc.balance ?? 0) <= amount ||
    receiverAcc.username === currentAcc.username
  )
    return handleTransferError({
      totalSum: currentAcc.balance,
      userTo: receiverAcc?.username,
      currentUser: currentAcc.username,
      transferAmount: amount,
    });

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

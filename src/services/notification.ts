const ERROR_TEXTS = {
  NO_USER: "The user you want to transfer money to does not exist",
  SELF: "You cannot transfer money to yourself",
  INVALID_NUM: "Amount to transfer should have a positive value",
  LOW_FUNDS: "Insufficient amount of money for the operation",
};

type ToastType = "success" | "warning" | "info" | "error";
type SuccessAction = "login" | "transfer" | "loan" | "closeAcc";
type TransferErrAction = "selfTransfer" | "noUser" | "noMoney" | "negValue";

interface SuccessNotificationData {
  name?: string;
  amount?: number;
  currency?: string;
}

interface TransferErrorData {
  totalSum?: number;
  userTo?: string;
  currentUser?: string;
  transferAmount?: number;
}

export function handleSuccess(
  action: SuccessAction,
  data?: SuccessNotificationData
): void {
  const messages: Record<SuccessAction, string> = {
    login: `Welcome back, ${data?.name}`,
    loan: `Your loan in the amount of ${data?.amount} ${data?.currency} was approved`,
    transfer: `You successfully transferred ${data?.amount} ${data?.currency} to ${data?.name}`,
    closeAcc: "Your account is now closed",
  };

  showToast(messages[action], "success");
}

export function handleTransferError(data: TransferErrorData): void {
  // Transfer to non-existing user
  if (data.userTo === undefined) return showToast(ERROR_TEXTS.NO_USER, "error");

  // Self-transfer
  if (data.userTo === data.currentUser)
    return showToast(ERROR_TEXTS.SELF, "error");

  // Negative amount value
  if (typeof data.transferAmount !== "number" || data.transferAmount <= 0)
    return showToast(ERROR_TEXTS.INVALID_NUM, "error");

  // Lack of money
  if (data.totalSum && data.totalSum < data.transferAmount)
    return showToast(ERROR_TEXTS.LOW_FUNDS, "error");

  showToast("Something went wrong with money transfer", "error");
}

function getOrCreateContainer(): HTMLDivElement {
  let container = document.querySelector(".toast__container") as HTMLDivElement;

  if (!container) {
    container = document.createElement("div");
    container.className = "toast__container";
    document.body.appendChild(container);
  }

  return container;
}

export function showToast(message: string, type: ToastType, duration = 3000) {
  const container = getOrCreateContainer();
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast--${type}`);
  toast.innerHTML = `
  <span class="toast__message">${message}</span>
  <button type="button" class="toast__close">&times;</button>
`;
  container.appendChild(toast);

  const handleClose = () => {
    toast.classList.add("toast--exit");

    toast.addEventListener(
      "animationend",
      (e) => {
        if (e.animationName === "slideOut") toast.remove();
      },
      { once: true }
    );
  };

  const closeIcon = document.querySelector(
    ".toast__close"
  ) as HTMLButtonElement;

  if (closeIcon) {
    closeIcon.addEventListener("click", handleClose);
  }

  setTimeout(handleClose, duration);
}

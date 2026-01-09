type ToastType = "success" | "warning" | "info" | "error";
type SuccessAction = "login" | "transfer" | "loan" | "closeAcc";

interface SuccessNotificationData {
  name?: string;
  amount?: number;
  currency?: string;
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

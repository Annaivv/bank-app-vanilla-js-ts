import { updateTimerLabel } from "../components/render";
import { containersUI, labelsUI } from "../constants/selectors";
import { showToast } from "./notification";
import { setCurrentAccount } from "./state";

let logoutTimer: number | undefined;

export const handleTimer = (): void => {
  if (logoutTimer) clearInterval(logoutTimer);

  let time = 300;
  updateTimerLabel(time);

  logoutTimer = setInterval(() => {
    time--;
    updateTimerLabel(time);

    if (time <= 10 && time > 0)
      showToast(`You will be logged out in ${time} seconds`, "warning", 10000);

    if (time === 0) {
      clearInterval(logoutTimer);
      labelsUI.welcome.textContent = "Log in to get started";
      containersUI.app.classList.remove("visible");
      setCurrentAccount(undefined);

      showToast("Session expired. Please log in again.", "info");
    }
  }, 1000);
};

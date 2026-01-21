import { closeSignupModal, openSignupModal } from "../components/render";
import { buttonsUI, containersUI } from "../constants/selectors";
import { handleLogin, handleSignupSubmit } from "../controllers/authController";
import { handleAccountClose } from "../services/accountService";
import {
  handleLoanRequest,
  handleTransfer,
} from "../services/transactionService";

export function setupEventListeners(): void {
  // Log in
  buttonsUI.login.addEventListener("click", function (e) {
    e.preventDefault();
    handleLogin();
  });

  // Transfer money to other user
  buttonsUI.transfer.addEventListener("click", function (e) {
    e.preventDefault();
    handleTransfer();
  });

  // Request a loan
  buttonsUI.loan.addEventListener("click", function (e) {
    e.preventDefault();
    handleLoanRequest();
  });

  // Close an account
  buttonsUI.close.addEventListener("click", function (e) {
    e.preventDefault();
    handleAccountClose();
  });

  // Open signup modal
  buttonsUI.signupOpenForm?.addEventListener("click", openSignupModal);

  // Close signup modal on ESC
  document.addEventListener("keydown", function (e: KeyboardEvent) {
    if (e.key === "Escape" && !containersUI.modal?.classList.contains("hidden"))
      closeSignupModal();
  });

  // Close signup modal on overlay click
  containersUI.overlay?.addEventListener("click", closeSignupModal);

  // Send signup form
  buttonsUI.signupSubmitForm?.addEventListener("click", handleSignupSubmit);
}

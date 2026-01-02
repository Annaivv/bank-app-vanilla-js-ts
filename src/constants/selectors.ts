export const labelsUI = {
  welcome: document.querySelector<HTMLParagraphElement>(".welcome")!,
  date: document.querySelector<HTMLParagraphElement>(".date")!,
  balance: document.querySelector<HTMLParagraphElement>(".balance__value")!,
  sumIn: document.querySelector<HTMLParagraphElement>(".summary__value--in")!,
  sumOut: document.querySelector<HTMLParagraphElement>(".summary__value--out")!,
  sumInterest: document.querySelector<HTMLParagraphElement>(
    ".summary__value--interest"
  )!,
  timer: document.querySelector<HTMLSpanElement>(".timer")!,
};

export const containersUI = {
  app: document.querySelector<HTMLElement>(".app")!,
  movements: document.querySelector<HTMLDivElement>(".movements")!,
};

export const buttonsUI = {
  login: document.querySelector<HTMLButtonElement>(".login__btn")!,
  transfer: document.querySelector<HTMLButtonElement>(".form__btn--transfer")!,
  loan: document.querySelector<HTMLButtonElement>(".form__btn--loan")!,
  close: document.querySelector<HTMLButtonElement>(".form__btn--close")!,
  sort: document.querySelector<HTMLButtonElement>(".btn--sort")!,
};

export const inputsUI = {
  loginUsername: document.querySelector<HTMLInputElement>(
    ".login__input--user"
  )!,
  loginPin: document.querySelector<HTMLInputElement>(".login__input--pin")!,
  transferTo: document.querySelector<HTMLInputElement>(".form__input--to")!,
  transferAmount: document.querySelector<HTMLInputElement>(
    ".form__input--amount"
  )!,
  loanAmount: document.querySelector<HTMLInputElement>(
    ".form__input--loan-amount"
  )!,
  closeUsername:
    document.querySelector<HTMLInputElement>(".form__input--user")!,
  closePin: document.querySelector<HTMLInputElement>(".form__input--pin")!,
};

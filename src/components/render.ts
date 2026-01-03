import { containersUI, labelsUI } from "../constants/selectors";
import type { Account } from "../types";
import { calcDaysPassed, formatCurrency, formatTime } from "../utils/helpers";

export const displayMovements = function (acc: Account, sort = false): void {
  containersUI.movements.innerHTML = "";

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    date: acc.movementsDates.at(i) ?? new Date().toISOString(),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach(function (action, i) {
    const type = action.movement > 0 ? "deposit" : "withdrawal";

    const actualDate = new Date();
    const movDate = new Date(action.date);
    const daysPassed = calcDaysPassed(movDate, actualDate, acc.locale);

    const movValue = formatCurrency(action.movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${daysPassed}</div>
        <div class="movements__value">${movValue}</div>
      </div>
    `;

    containersUI.movements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc: Account): void {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelsUI.balance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc: Account): void {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelsUI.sumIn.textContent = formatCurrency(
    incomes,
    acc.locale,
    acc.currency
  );

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelsUI.sumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelsUI.sumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

export const updateTimerLabel = (time: number) => {
  labelsUI.timer.textContent = formatTime(time);
};

export const updateUI = function (acc: Account): void {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

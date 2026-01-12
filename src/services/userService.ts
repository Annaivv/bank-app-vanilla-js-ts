import type { Account } from "../types";
import {
  createUsername,
  getCurrencyFromLocale,
  locale,
} from "../utils/helpers";
import { getAccountsData, setAccountsData } from "./storage";

export function addUser(fullName: string, pin: number) {
  const currency = getCurrencyFromLocale();

  const newUser: Account = {
    owner: fullName,
    username: createUsername(fullName),
    movements: [5000],
    interestRate: 1.2,
    pin,
    movementsDates: [new Date().toISOString()],
    currency,
    locale,
    balance: 0,
  };

  const storedAccounts: Account[] = getAccountsData();
  storedAccounts.push(newUser);
  setAccountsData(storedAccounts);
}

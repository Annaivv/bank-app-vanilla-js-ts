import type { Account } from "../types";
import { createUsername, locale } from "../utils/helpers";
import { getAccountsData, setAccountsData } from "./storage";

export function addUser(fullName: string, pin: number) {
  const newUser: Account = {
    owner: fullName,
    username: createUsername(fullName),
    movements: [],
    interestRate: 1.2,
    pin,
    movementsDates: [],
    currency: "USD",
    locale,
    balance: 0,
  };

  const storedAccounts: Account[] = getAccountsData();
  storedAccounts.push(newUser);
  setAccountsData(storedAccounts);
  console.log(newUser);
}

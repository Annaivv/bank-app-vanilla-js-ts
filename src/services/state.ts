import type { Account } from "../types";
import { getAccountsData } from "./storage";

let currentAccount: Account | undefined;
export let accounts: Account[] = [];

export const getCurrentAccount = (): Account | undefined => {
  return currentAccount;
};

export const setCurrentAccount = (acc: Account | undefined): void => {
  currentAccount = acc;
};

export const syncStateWithStorage = (): void => {
  accounts = getAccountsData();
};

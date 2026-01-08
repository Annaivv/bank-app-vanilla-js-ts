import type { Account } from "../types";
import { accounts as defaultAccounts } from "../data/accounts";

const STORAGE_KEY = "bank_accounts_data";

export function getAccountsData(): Account[] {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return defaultAccounts;
  }

  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.warn("No data in local storage!");
    return defaultAccounts;
  }
}

export function setAccountsData(accounts: Account[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error("Could not store data", error);
  }
}

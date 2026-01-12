import isoCountryCurrency from "iso-country-currency";
import { accounts } from "../data/accounts";

export const locale = navigator.language;

export const calcDaysPassed = (
  date1: Date,
  date2: Date,
  locale: string
): string => {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else return new Intl.DateTimeFormat(locale).format(date1);
};

export const getCurrencyFromLocale = (): string => {
  try {
    const region = new Intl.Locale(locale).maximize().region;

    if (!region) return "USD";

    return isoCountryCurrency.getParamByISO(region, "currency");
  } catch (error) {
    console.error(error);
    return "USD";
  }
};

export const formatCurrency = (
  value: number,
  locale: string,
  currency: string
): string => {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value
  );
};

export const createUsername = (accountOwner: string): string => {
  return accountOwner
    .toLowerCase()
    .split(" ")
    .map((name) => name[0])
    .join("");
};

accounts.forEach(
  (account) => (account.username = createUsername(account.owner))
);

export const formatTime = (totalSeconds: number): string => {
  const minutes = String(Math.trunc(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

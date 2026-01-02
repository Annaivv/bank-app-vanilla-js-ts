import { accounts } from "../data/accounts";
import type { Account } from "../types";

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

export const formatCurrency = (
  value: number,
  locale: string,
  currency: string
): string => {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value
  );
};

const createUsernames = function (accs: Account[]) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

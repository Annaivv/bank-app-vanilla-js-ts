export interface Account {
  owner: string;
  movements: number[];
  interestRate: number;
  pin: number;
  movementsDates: string[];
  currency: string;
  locale: string;
}

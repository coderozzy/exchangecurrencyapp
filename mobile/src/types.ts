export interface CurrencyRate {
  currency: string;
  code: string;
  mid: number;
}

export interface ExchangeRate extends CurrencyRate {
  buy: number;
  sell: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  wallet: Wallet;
}

export interface Wallet {
  PLN: number;
  [currencyCode: string]: number;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  currencyCode: string;
  amountCurrency: number;
  amountPLN: number;
  rate: number;
  date: string;
}

export interface RateHistoryItem {
  effectiveDate: string;
  mid: number;
}

export interface WalletInfo {
  availabalBalance: number;
  balance: number;
  createTime: string;
  customerId: string;
  frozenBalance: number;
  id: string;
  totalExpense: number;
  totalIncome: number;
  updateTime: string;
  walletNo: string;
}

export interface Coupon {
  id: string;
  createTime: string;
  updateTime: string;
  code: string;
  customerId: string;
  src: number;
  srcMsg: string;
  couponId: string;
  couponType: number;
  couponTypeMsg: string;
  couponDenomination: number;
  thresholdAmount: number;
  inviterEmail: string;
  status: number;
  statusMsg: string;
  expirationDate: string;
}

export interface WalletState {
  wallet: WalletInfo | null;
  setWallet: (wallet: WalletInfo | null) => void;
  clearWallet: () => void;
}

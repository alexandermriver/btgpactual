export class Transaction {

  transactionId: string;
  userId: string;
	fundId: string;
  fundName: string;
  amount: number;
  transactionType: string;
	date: string;
  notificationMethod: string;
  phoneNumber: string;
  email: string;

  constructor(config:{
    transactionId?: string,
    userId?: string,
    fundId?: string,
    fundName?: string,
    amount?: number,
    transactionType?: string,
    date?: string,
    notificationMethod?: string,
    phoneNumber?: string,
    email?: string
  }) {
    this.transactionId = config.transactionId ?? '';
    this.userId = config.userId ?? '';
    this.fundId = config.fundId ?? '';
    this.fundName = config.fundName ?? '';
    this.amount = config.amount ?? 0;
    this.transactionType = config.transactionType ?? '';
    this.date = config.date ?? '';
    this.notificationMethod = config.notificationMethod ?? '';
    this.phoneNumber = config.phoneNumber ?? '';
    this.email = config.email ?? '';
  };

};
export class SubscriptionRequest {

  userId: string;
  fundId: string;
	amount: number;
  notificationMethod: string;
  phoneNumber: string;
  email: string;

  constructor(
    userId?: string,
    fundId?: string,
    amount?: number,
    notificationMethod?: string,
    phoneNumber?: string,
    email?: string
  ) {
    this.userId = userId ?? '';
    this.fundId = fundId ?? '';
    this.amount = amount ?? 0;
    this.notificationMethod = notificationMethod ?? '';
    this.phoneNumber = phoneNumber ?? '';
    this.email = email ?? '';
  };

};
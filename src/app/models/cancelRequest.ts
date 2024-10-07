export class CancelRequest {

  userId: string;
  fundId: string;

  constructor(
    userId?: string,
    fundId?: string
  ) {
    this.userId = userId ?? '';
    this.fundId = fundId ?? '';
  };

};
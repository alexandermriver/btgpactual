import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Transaction } from "../models/transaction";
import { SubscriptionRequest } from "../models/subscriptionRequest";
import { CancelRequest } from "../models/cancelRequest";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly url: string = `${ environment.HOST }/api/transactions`;

  constructor(private readonly httpClient: HttpClient) { };

  public getAllTransactions(username: string): Observable<HttpResponse<Transaction[]>> {
    const url = `${this.url}/${username}`;
    return this.httpClient.get<Transaction[]>(url, { observe: 'response' });
  };

  public saveTransaction(request: SubscriptionRequest): Observable<HttpResponse<any>> {
    const url = `${this.url}/subscribe`;
    return this.httpClient.post<any>(url, request, { observe: 'response' });
  };

  public cancelTransaction(request: CancelRequest): Observable<HttpResponse<any>> {
    const url = `${this.url}/cancelSubscription`;
    return this.httpClient.post<any>(url, request, { observe: 'response' });
  };

};
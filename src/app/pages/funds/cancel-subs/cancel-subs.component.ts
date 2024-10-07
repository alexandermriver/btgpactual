import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transactions.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Transaction } from '../../../models/transaction';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SubscriptionRequest } from '../../../models/subscriptionRequest';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CancelRequest } from '../../../models/cancelRequest';


@Component({
  selector: 'app-cancel-subs',
  templateUrl: './cancel-subs.component.html',
  styleUrls: ['./cancel-subs.component.less'],
  standalone: true,
  imports:[NzFormModule, FormsModule, ReactiveFormsModule, NzInputModule, NzSelectModule,
    NzButtonModule, CommonModule, NzModalModule, NzResultModule, NzSpinModule]
})

export class CancelSubsComponent implements OnInit, OnDestroy {

  constructor(private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService
  ) {};

  public validateForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  public transactionsList: Transaction[] = [];
  public loadingTransactions: boolean = false;
  public isVisible = false;
  public errorMsg = '';
  public successfulTransaction: boolean = false;
  public result: Transaction = null;

  funds = [
    { value: '1', label: 'FPV_BTG_PACTUAL_RECAUDADORA', minAmount: 75000 },
    { value: '2', label: 'FPV_BTG_PACTUAL_ECOPETROL', minAmount: 125000 },
    { value: '3', label: 'DEUDAPRIVADA', minAmount: 50000 },
    { value: '4', label: 'FDO-ACCIONES', minAmount: 250000 },
    { value: '5', label: 'FPV_BTG_PACTUAL_DINAMICA', minAmount: 100000 }
  ];

  ngOnInit(): void {
    this.initForm();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  };

  private initForm(): void {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      fundName: ['', [Validators.required]]
    });
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      this.cancelSubscription();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        };
      });
    };
  };

  private cancelSubscription(): void {
    this.showModal();
    const request = new CancelRequest(
      this.validateForm.get('userName').value,
      this.validateForm.get('fundName').value
    );
    this.loadingTransactions = true;
    this.transactionService.cancelTransaction(request)
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loadingTransactions = false;
      })
    ).subscribe({
        next: (result) => {
          this.successfulTransaction = true;
          this.validateForm.reset();
          this.errorMsg = '';
          this.result = result.body;
        },
        error: (error) => {
          this.result = null;
          this.errorMsg = error?.error?.msg;
          this.successfulTransaction = false;
          this.showModal();
        }
    });
  };

  showModal(): void {
    this.isVisible = true;
  };

  handleCancel(): void {
    this.isVisible = false;
  };

};
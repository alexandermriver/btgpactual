import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transactions.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Transaction } from '../../../models/transaction';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SubscriptionRequest } from '../../../models/subscriptionRequest';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-suscribe',
  templateUrl: './suscribe.component.html',
  styleUrls: ['./suscribe.component.less'],
  standalone: true,
  imports:[NzFormModule, FormsModule, ReactiveFormsModule, NzInputModule, NzSelectModule,
           NzButtonModule, CommonModule, NzModalModule, NzResultModule, NzSpinModule]
})

export class SuscribeComponent implements OnInit, OnDestroy {

  constructor(private readonly fb: FormBuilder,
    private readonly transactionService: TransactionService
  ) {};

  public validateForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  public transactionsList: Transaction[] = [];
  public loadingTransactions: boolean = false;
  public isVisible = false;
  public errorMsg = '';
  public selectedMinAmount: number = 0;
  public successfulTransaction: boolean = false;

  funds = [
    { value: '1', label: 'FPV_BTG_PACTUAL_RECAUDADORA', minAmount: 75000 },
    { value: '2', label: 'FPV_BTG_PACTUAL_ECOPETROL', minAmount: 125000 },
    { value: '3', label: 'DEUDAPRIVADA', minAmount: 50000 },
    { value: '4', label: 'FDO-ACCIONES', minAmount: 250000 },
    { value: '5', label: 'FPV_BTG_PACTUAL_DINAMICA', minAmount: 100000 }
  ];

  notiMethods = [
    'EMAIL',
    'SMS'
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
      fundName: ['', [Validators.required]],
      amount: ['', [Validators.required, this.amountValidator.bind(this)]],
      notificationMethod: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.validateForm.get('fundName')?.valueChanges.subscribe(fundValue => {
      const selectedFund = this.funds.find(f => f.value === fundValue);
      this.selectedMinAmount = selectedFund ? selectedFund.minAmount : 0;
      this.validateForm.get('amount')?.updateValueAndValidity();
    });
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      this.saveTransaction();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        };
      });
    };
  };

  private amountValidator(control: any): { [key: string]: boolean } | null {
    const selectedFund = this.validateForm?.get('fundName')?.value;
    const amount = control.value;
    const fund = this.funds.find(f => f.value === selectedFund);
    if (fund && amount < fund.minAmount) {
      return { 'amountTooLow': true };
    };
    if (fund && amount > 500000) {
      return { 'amountLimit': true };
    };
    return null;
  };

  public getAmountErrorTip(): string {
    const amountControl = this.validateForm.get('amount');
    if (amountControl?.hasError('required')) {
      return 'Por favor ingresa un monto';
    };
    if (amountControl?.hasError('amountTooLow')) {
      return `El monto debe ser mayor o igual a $ ${this.selectedMinAmount}`;
    };
    if (amountControl?.hasError('amountLimit')) {
      return `El monto debe ser menor o igual a $ 500000`;
    };
    return '';
  };

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && value.toString().length < 10) {
        return { minLength: true };
      };
      if (value && value.toString().length > 10) {
        return { maxLength: true };
      };
      return null;
    };
  };

  private saveTransaction(): void {
    this.showModal();
    const request = new SubscriptionRequest(
      this.validateForm.get('userName').value,
      this.validateForm.get('fundName').value,
      this.validateForm.get('amount').value,
      this.validateForm.get('notificationMethod').value,
      this.validateForm.get('phoneNumber').value,
      this.validateForm.get('email').value
    );
    this.loadingTransactions = true;
    this.transactionService.saveTransaction(request)
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
        },
        error: (error) => {
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transactions.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Transaction } from '../../../models/transaction';
import { CommonModule, DatePipe } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-history-transactions',
  templateUrl: './history-transactions.component.html',
  styleUrls: ['./history-transactions.component.less'],
  standalone: true,
  imports:[NzFormModule, FormsModule, ReactiveFormsModule, NzInputModule,
           NzButtonModule, NzTableModule, CommonModule, NzModalModule, NzResultModule],
  providers: [DatePipe]
})

export class HistoryTransactionsComponent implements OnInit, OnDestroy {

  constructor(private readonly fb: FormBuilder,
              private readonly transactionService: TransactionService,
              private readonly datePipe: DatePipe
  ) {};

  public validateForm!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  public transactionsList: Transaction[] = [];
  public totalItems: number = 0;
  public loadingTransactions: boolean = false;
  public isVisible = false;
  public errorMsg = '';

  ngOnInit(): void {
    this.initForm();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  };

  private initForm(): void {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]]
    });
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      this.getTransactions();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        };
      });
    };
  };

  private getTransactions(): void {
    this.loadingTransactions = true;
    this.transactionService.getAllTransactions(this.validateForm.get('userName').value)
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loadingTransactions = false;
      })
    ).subscribe({
        next: (result) => {
          this.transactionsList = result.body;
          this.totalItems = result.body.length;
          this.errorMsg = '';
        },
        error: (error) => {
          this.errorMsg = error?.error?.msg;
          this.transactionsList = [];
          this.totalItems = 0;
          this.showModal();
        }
    });
  };

  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'dd-MM-yyyy h:mm a');
  };

  showModal(): void {
    this.isVisible = true;
  };

  handleCancel(): void {
    this.isVisible = false;
  };

};
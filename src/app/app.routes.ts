import { Routes } from '@angular/router';
import { SuscribeComponent } from './pages/funds/suscribe/suscribe.component';
import { CancelSubsComponent } from './pages/funds/cancel-subs/cancel-subs.component';
import { HistoryTransactionsComponent } from './pages/funds/history-transactions/history-transactions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'funds/suscribe', pathMatch: 'full' },
  { path: 'funds/suscribe', component: SuscribeComponent },
  { path: 'funds/cancel-subs', component: CancelSubsComponent },
  { path: 'funds/transactions', component: HistoryTransactionsComponent },
  { path: '**', redirectTo: 'funds/suscribe' }
];

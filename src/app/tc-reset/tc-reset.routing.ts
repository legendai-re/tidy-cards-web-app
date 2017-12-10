import { TcResetInitiateComponent } from './tc-reset-initiate/tc-reset-initiate.component';
import { TcResetCompleteComponent } from './tc-reset-complete/tc-reset-complete.component';

export const TcResetRoutes = [
{ path: 'reset/initiate', component: TcResetInitiateComponent },
{ path: 'reset/complete/:reset_token', component: TcResetCompleteComponent }
];

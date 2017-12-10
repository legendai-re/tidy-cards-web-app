import { TcDashboardComponent } from './tc-dashboard.component';
import { GrantedUser }          from '../tc-auth/tc-auth.guard';

export const TcDashboardRoutes = [
{ path: 'dashboard', component: TcDashboardComponent, canActivate: [GrantedUser] }
];

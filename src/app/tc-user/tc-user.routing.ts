import { GrantedUser }          from '../tc-auth/tc-auth.guard';
import { TcUserComponent }    from './tc-user.component';
import { TcConfirmEmailComponent } from './tc-confirm-email/tc-confirm-email.component';

export const TcUserRoutes = [
{ path: ':user_id', component: TcUserComponent },
{ path: 'accounts/confirm_email/:confirm_token', component: TcConfirmEmailComponent, canActivate: [GrantedUser] }
];

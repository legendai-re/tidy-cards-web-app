import { GrantedUser }       from './tc-auth.guard';
import { GrantedAnonymous }  from './tc-auth.guard';
import { GrantedAdmin }      from './tc-auth.guard';
import { HomeGuard }         from './tc-auth.guard';
import { TcAuthService }     from './tc-auth.service';
import { TcAuthComponent }   from './tc-auth.component';
import { TcLogoutComponent } from './tc-logout/tc-logout.component';

export const TcAuthRoutes = [
{ path: 'signin', component: TcAuthComponent, canActivate: [GrantedAnonymous] },
{ path: 'logout', component: TcLogoutComponent, canActivate: [GrantedUser] }
];

export const authProviders = [
  GrantedUser,
  GrantedAdmin,
  GrantedAnonymous,
  TcAuthService,
  HomeGuard
];


import { GrantedAdmin } from '../tc-auth/tc-auth.guard';
import { TcAdminHomeComponent } from './tc-admin-home.component';
import { TcAdminFeaturedComponent } from './tc-admin-featured.component';
import { TcAdminUsersComponent } from './tc-admin-users.component';

export const TcAdminRoutes = [
{ path: 'admin',  component: TcAdminHomeComponent, canActivate: [GrantedAdmin] },
{ path: 'admin/featured',  component: TcAdminFeaturedComponent, canActivate: [GrantedAdmin] },
{ path: 'admin/users',  component: TcAdminUsersComponent, canActivate: [GrantedAdmin] }
];

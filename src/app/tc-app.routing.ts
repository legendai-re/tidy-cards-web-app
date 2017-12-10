import { Routes, RouterModule } from '@angular/router';

import { HomeGuard }                   from './tc-auth/tc-auth.guard';
import { TcAppComponent }              from './tc-app.component';
import { TcDiscoverRoutes }            from './tc-discover/tc-discover.routing';
import { TcDashboardRoutes }           from './tc-dashboard/tc-dashboard.routing';
import { TcCollectionRoutes }          from './tc-collection/tc-collection.routing';
import { TcAdminRoutes }               from './tc-admin/tc-admin.routing';
import { TcAuthRoutes, authProviders } from './tc-auth/tc-auth.routing';
import { TcUserRoutes }                from './tc-user/tc-user.routing';
import { TcResetRoutes }               from './tc-reset/tc-reset.routing';
import { TcSearchRoutes }              from './tc-search/tc-search.routing';
import { TcPageRoutes }                from './tc-page/tc-page.routing';

const appRoutes: Routes = [
    ...TcDiscoverRoutes,
    ...TcDashboardRoutes,
    ...TcCollectionRoutes,
    ...TcSearchRoutes,
    ...TcPageRoutes,
    ...TcAdminRoutes,
    ...TcAuthRoutes,
    ...TcResetRoutes,
    ...TcUserRoutes,
    //{ path: '', component: TcAppComponent, canActivate: [HomeGuard] },
    { path: '**', component: TcAppComponent, canActivate: [HomeGuard] }
];

export const appRoutingProviders: any[] = [
    authProviders
];

export const routing = RouterModule.forRoot(appRoutes);

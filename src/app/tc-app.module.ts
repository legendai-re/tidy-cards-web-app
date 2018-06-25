import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';

import { TcAppComponent }               from './tc-app.component';
import { routing, appRoutingProviders } from './tc-app.routing';

//Modules
import { TcAuthModule }           from './tc-auth/tc-auth.module';
import { TcCollectionModule }     from './tc-collection/tc-collection.module';
import { TcCollectionCardModule } from './tc-collection/tc-collection-card/tc-collection-card.module';
import { TcCollectionCreateModule } from './tc-collection/tc-collection-create/tc-collection-create.module';
import { TcHeaderModule }         from './tc-header/tc-header.module';
import { TcFooterModule }         from './tc-footer/tc-footer.module';
import { TcItemModule }           from './tc-item/tc-item.module';
import { TcPageModule }           from './tc-page/tc-page.module';
import { TcSearchModule }         from './tc-search/tc-search.module';
import { TcSharedModule }         from './tc-shared/tc-shared.module';
import { TcUserModule }           from './tc-user/tc-user.module';
import { TcPaymentModule }        from './tc-payment/tc-payment.module';

//Components
import { TcAdminFeaturedComponent } from './tc-admin/tc-admin-featured.component';
import { TcAdminHomeComponent }     from './tc-admin/tc-admin-home.component';
import { TcAdminUsersComponent }     from './tc-admin/tc-admin-users.component';

import { TcDashboardComponent }      from './tc-dashboard/tc-dashboard.component';

import { TcDiscoverComponent }       from './tc-discover/tc-discover.component';

import { TcResetCompleteComponent } from './tc-reset/tc-reset-complete/tc-reset-complete.component';
import { TcResetInitiateComponent } from './tc-reset/tc-reset-initiate/tc-reset-initiate.component';

//Services
import { CookieService }       from 'ngx-cookie-service';
import { TcUserService }       from './tc-user/tc-user.service';
import { TcImgUploadService }  from './tc-image/tc-image-upload.service';
import { TcAuthService }       from './tc-auth/tc-auth.service';
import { TcHeaderService }     from './tc-header/tc-header.service';
import { TcSearchService }     from './tc-search/tc-search.service';
import { TcResetService }      from './tc-reset/tc-reset.service';
import { TcLanguageService }   from './tc-language/tc-language.service';
import { TcCollectionService } from './tc-collection/tc-collection.service';
import { TcStarService }       from './tc-star/tc-star.service';
import { TcItemService }       from './tc-item/tc-item.service';
import { TcPaymentService }    from './tc-payment/tc-payment.service';
import { TcBase64 }            from './tc-shared/tc-base64.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        TcAuthModule,
        TcCollectionModule,
        TcCollectionCardModule,
        TcCollectionCreateModule,
        TcHeaderModule,
        TcFooterModule,
        TcItemModule,
        TcPageModule,
        TcSearchModule,
        TcSharedModule,
        TcUserModule,
        TcPaymentModule,
        routing,
    ],
    declarations: [
        TcAppComponent,
        TcAdminFeaturedComponent,
        TcAdminHomeComponent,
        TcAdminUsersComponent,
        TcDashboardComponent,
        TcDiscoverComponent,
        TcResetCompleteComponent,
        TcResetInitiateComponent,
    ],
    providers: [
        Title,
        appRoutingProviders,
        CookieService,
        TcCollectionService,
        TcStarService,
        TcItemService,
        TcUserService,
        TcImgUploadService,
        TcAuthService,
        TcHeaderService,
        TcSearchService,
        TcResetService,
        TcLanguageService,
        TcPaymentService,
        TcBase64
    ],
    bootstrap: [TcAppComponent]
})
export class AppModule {
}

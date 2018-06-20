import { TcAboutComponent }   from './tc-about/tc-about.component';
import { TcContactComponent } from './tc-contact/tc-contact.component';
import { TcTeamComponent }    from './tc-team/tc-team.component';
import { TcTermsComponent }   from './tc-terms/tc-terms.component';
import { TcPrivacyComponent }   from './tc-privacy/tc-privacy.component';

export const TcPageRoutes = [
{ path: 'about',  component: TcAboutComponent },
{ path: 'contact',  component: TcContactComponent },
{ path: 'team',  component: TcTeamComponent },
{ path: 'terms',  component: TcTermsComponent },
{ path: 'privacy',  component: TcPrivacyComponent },
];

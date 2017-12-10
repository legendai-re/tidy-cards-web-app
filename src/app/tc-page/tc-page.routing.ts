import { TcAboutComponent }   from './tc-about/tc-about.component';
import { TcContactComponent } from './tc-contact/tc-contact.component';
import { TcTeamComponent }    from './tc-team/tc-team.component';
import { TcTermsComponent }   from './tc-terms/tc-terms.component';

export const TcPageRoutes = [
{ path: 'about',  component: TcAboutComponent },
{ path: 'contact',  component: TcContactComponent },
{ path: 'team',  component: TcTeamComponent },
{ path: 'terms',  component: TcTermsComponent },
];


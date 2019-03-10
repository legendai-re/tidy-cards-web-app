import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TcAuthService } from './tc-auth/tc-auth.service';
import { TcLanguageService } from './tc-language/tc-language.service';
import { TcHeaderService } from './tc-header/tc-header.service';
import { environment } from '../environments/environment';
import { UUID } from 'angular2-uuid';

declare var window: any;

@Component({
  selector: 'tc-app',
  templateUrl: './tc-app.component.html',
  styleUrls: ['./tc-app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TcAppComponent {

  constructor(
    public headerService: TcHeaderService,
    public t: TcLanguageService,
    public authService: TcAuthService,
    public router: Router) {

    let url = null;
    this.router.events.subscribe((route) => {
      if (!url) {

        let routeAny: any;
        routeAny = route;
        url = routeAny.url.split(';')[0];
        const params = [];

        for (let i = 1; i < routeAny.url.split(';').length; i++) {
          const keyValue = routeAny.url.split(';')[i].split('=');
          if (keyValue.length === 2)
            params[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }

        // add analytics
        document.write('<script> !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0"; analytics.load("'+environment.segmentApiKey+'"); analytics.page(); }}(); </script>');

        authService.initCurrentUser().then(success => {

          // Identify users when logged in
          if (this.authService.isLoggedIn) {
            window.analytics.identify(this.authService.currentUser._id, {
              name: this.authService.currentUser.name,
              email: this.authService.currentUser.email
            });
          } else{
            window.analytics.identify(this.authService.getAnonymousUuid())
          }

          router.initialNavigation();
          url = url.replace('#_=_', '');
          if (url !== '/' && url !== '/discover')
            this.router.navigate([url, params]);
          if (this.authService.isLoggedIn && url === '/')
            this.router.navigate([url]);
        });

      }
    });

  }

}

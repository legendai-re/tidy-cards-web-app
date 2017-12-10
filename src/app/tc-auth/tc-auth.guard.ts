import { Injectable }             from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { TcAuthService }        from './tc-auth.service';

@Injectable()
export class GrantedAnonymous implements CanActivate {
    constructor(private authService: TcAuthService, private router: Router) {}

    canActivate(next:  ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.authInitialized && !this.authService.isLoggedIn) { return true; }
        this.router.navigate(['/']);
        return false;
    }
}

@Injectable()
export class GrantedUser implements CanActivate {
    constructor(private authService: TcAuthService, private router: Router) {}

    canActivate(next:  ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if ( this.authService.isLoggedIn ) { return true; }
        this.router.navigate(['/signin', {next: encodeURIComponent(state.url)}]);
        return false;
    }
}

@Injectable()
export class GrantedAdmin implements CanActivate {
    constructor(private authService: TcAuthService, private router: Router) {}

    canActivate(next:  ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if ( this.authService.isLoggedIn && this.authService.currentUser.isGranted('ROLE_ADMIN') ) { return true; }
        if( !this.authService.isLoggedIn )
            this.router.navigate(['/signin', {next: encodeURIComponent(state.url)}]);
        else
            this.router.navigate(['/']);
        return false;
    }
}

@Injectable()
export class HomeGuard implements CanActivate {
    constructor(private authService: TcAuthService, private router: Router) {}

    canActivate(next:  ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if ( this.authService.isLoggedIn ) {
            this.router.navigate(['/dashboard']);
        }
        if ( !this.authService.isLoggedIn ) {
            this.router.navigate(['/discover']);
        }
        return false;
    }
}

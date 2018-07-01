import { Component, OnInit }   from '@angular/core';
import { Router }      from '@angular/router';
import { TcAuthService } from '../tc-auth.service';
import { TcUser }        from '../../tc-user/tc-user.class';
import { TcUserService } from '../../tc-user/tc-user.service';
import { TcLanguageService } from '../../tc-language/tc-language.service';

declare var window: any;

@Component({
    selector: 'tc-signup',
    templateUrl: './tc-signup.component.html',
    styleUrls: ['../tc-auth.component.scss']
})

export class TcSignupComponent implements OnInit {

    public passWordValid: boolean;
    public usernameState: string;
    public validatingUsername: boolean;
    public typingUsernameTimer;
    public doneTypingUsernameInterval: number;

    public emailState: string;
    public validatingEmail: boolean;
    public typingEmailTimer;
    public doneTypingEmailInterval: number;

    public signupInProgress: boolean;

    signupData = new class SignupData{
        username: string;
        lastChekedUsername: string;
        email: string;
        lastChekedEmail: string;
        password: string;
        passwordRepeat: string;
    };

    constructor(public t: TcLanguageService, private userService: TcUserService, public authService: TcAuthService, public router: Router) {
        this.doneTypingUsernameInterval = 1000;
        this.doneTypingEmailInterval = 1000;
    }

    ngOnInit(){
    }

    public onUsernameKeyUp(){
        if(this.signupData.lastChekedUsername == this.signupData.username)
            return;
        this.signupData.lastChekedUsername = this.signupData.username;
        this.usernameState = TcUser.isValidUsername(this.signupData.username) ? 'VALIDATING' : 'INVALID';
        clearTimeout(this.typingUsernameTimer);
        new Promise((resolve, reject) => {
            this.typingUsernameTimer = setTimeout(()=>{resolve(true);}, this.doneTypingUsernameInterval);
        }).then((e)=>{
            this.checkUsername();
        })
    }

    public onUsernameKeyDown(){
        clearTimeout(this.typingUsernameTimer);
    }

    public checkUsername(){
        if(!this.signupData.username || !TcUser.isValidUsername(this.signupData.username)){
            this.usernameState = 'INVALID';
            return;
        }
        this.userService.getValidUsername(this.signupData.username).subscribe((isValid) => {
            this.usernameState = isValid ? 'FREE' : 'TAKEN';
            this.validatingUsername = false;
        })
    }

    public onEmailKeyUp(){
        if(this.signupData.lastChekedEmail == this.signupData.email)
            return;
        this.signupData.lastChekedEmail = this.signupData.email;
        this.emailState = TcUser.isValidEmail(this.signupData.email) ? 'VALIDATING' : 'INVALID';
        clearTimeout(this.typingEmailTimer);
        new Promise((resolve, reject) => {
            this.typingEmailTimer = setTimeout(()=>{resolve(true);}, this.doneTypingEmailInterval);
        }).then((e)=>{
            this.checkEmail();
        })
    }

    public onEmailKeyDown(){
        clearTimeout(this.typingEmailTimer);
    }

    public checkEmail(){
        if(!TcUser.isValidEmail(this.signupData.email)){
            this.emailState = 'INVALID';
            return;
        }
        this.userService.getValidEmail(this.signupData.email).subscribe((isValid) => {
            this.emailState = isValid ? 'FREE' : 'TAKEN';
        })
    }

    public isFormValid(){
        return  this.usernameState == 'FREE' &&
                this.emailState == 'FREE' &&
                this.signupData.password &&
                this.signupData.password.length > 3 &&
                this.signupData.password === this.signupData.passwordRepeat;
    }

    onSignupSubmit() {
        if(!this.isFormValid())
            return;
        this.signupInProgress = true;
        let user = new TcUser(
                undefined,
                undefined,
                undefined,
                this.signupData.username,
                this.signupData.username,
                this.signupData.email,
                this.signupData.password
            );
        this.authService.signup(user).then(success => {
            window.analytics.alias(this.authService.getAnonymousUuid(), this.authService.currentUser._id)
            window.analytics.identify(this.authService.currentUser._id, {
                name: this.authService.currentUser.username,
                email: this.authService.currentUser.email
            });
            window.analytics.track('Sign Up', {
                id: this.authService.currentUser._id,
                email: this.authService.currentUser.email
            });
            this.router.navigate(['/']);
            this.signupInProgress = false;
        }, (err) => {
            this.signupInProgress = false;
        });
    }

    public connectWith(strategy){
        window.location.href = 'auth/' + strategy;
    }

}

import { Component, OnInit, ViewChild, Renderer, ElementRef }    from '@angular/core';
import { Router } from '@angular/router';
import { Title }                from '@angular/platform-browser';
import { TcAuthService }        from '../../tc-auth/tc-auth.service';
import { TcLanguageService }    from '../../tc-language/tc-language.service';
import { TcImage }              from '../../tc-image/tc-image.class';
import { TcImgUploadService }   from '../../tc-image/tc-image-upload.service';
import { TcUser }               from '../tc-user.class';
import { TcUserService }        from '../tc-user.service';

declare var window: any;

@Component({
    selector: 'tc-private-profile',
    styleUrls: ['../tc-user.component.scss'],
    templateUrl: './tc-user-private.component.html'
})

export class TcUserPrivateComponent implements OnInit {

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('usernameInput') usernameInput: ElementRef;
    @ViewChild('emailInput') emailInput: ElementRef;

    public updateGeneralInfoIntent: boolean;
    public isUpdadingGeneralInfo: boolean;

    public avatarFileInput: any;
    public isUploadingAvatar: boolean;

    public usernameState: string;
    public updateUsernameIntent: boolean;
    public isUpdatingUsername: boolean;
    public typingUsernameTimer;
    public doneTypingUsernameInterval: number;

    public emailState: string;
    public updateEmailIntent: boolean;
    public isUpdatingEmail: boolean;
    public validatingEmail: boolean;
    public typingEmailTimer;
    public doneTypingEmailInterval: number;

    public isUpdatingLanguage: boolean;

    public uploader;
    public tmpAvatar: TcImage;
    public tmpUser: TcUser;

    public password: string;
    public newPassword: string;
    public newPasswordRepeat: string;
    public isUpdatingPassword: boolean;
    public passwordUpdateState: string;

    constructor(
        public t: TcLanguageService,
        private _renderer: Renderer,
        private userService: TcUserService,
        private imgUploadService: TcImgUploadService,
        public authService: TcAuthService,
        public router: Router,
        private titleService: Title) {

        this.uploader = imgUploadService.uploader;
        this.doneTypingUsernameInterval = 1000;
        this.doneTypingEmailInterval = 1000;
    }

    ngOnInit(){
        this.titleService.setTitle(this.authService.currentUser.name + ' | TidyCards');
        this.tmpUser = TcUser.createFormJson(this.authService.currentUser);
        this.tmpUser._avatar = null;

        this.usernameState = 'PENDING';
        this.emailState = 'PENDING';

        this.updateGeneralInfoIntent = true;
    }

    public startUpdateGeneralInfo(){
        this.updateGeneralInfoIntent = true;
        // setTimeout( () => {
        //     this._renderer.invokeElementMethod(this.nameInput.nativeElement, 'focus', []);
        // }, 100);
    }

    public cancelUpdateGeneralInfo(){
        if(this.isUpdadingGeneralInfo)
            return;
        this.updateGeneralInfoIntent = false;
        this.tmpUser._avatar = null;
        this.tmpUser.name = JSON.parse(JSON.stringify(this.authService.currentUser.name));
        this.tmpUser.username = JSON.parse(JSON.stringify(this.authService.currentUser.username));
        this.tmpUser.bio = this.authService.currentUser.bio ? JSON.parse(JSON.stringify(this.authService.currentUser.bio)) : '';
        this.isUploadingAvatar = false;
    }

    public startUpdateUsername(){
        this.updateUsernameIntent = true;
        setTimeout( () => {
            this._renderer.invokeElementMethod(this.usernameInput.nativeElement, 'focus', []);
        }, 100);
    }

    public cancelUpdateUsername(){
        if(this.isUpdatingUsername)
            return;
        this.updateUsernameIntent = false;
        this.tmpUser.username = JSON.parse(JSON.stringify(this.authService.currentUser.username));
    }

    public startUpdateEmail(){
        this.updateEmailIntent = true;
        setTimeout( () => {
            this._renderer.invokeElementMethod(this.emailInput.nativeElement, 'focus', []);
        }, 100);
    }

    public cancelUpdateEmail(){
        if(this.isUpdatingEmail)
            return;
        this.updateEmailIntent = false;
        this.tmpUser.email = JSON.parse(JSON.stringify(this.authService.currentUser.email));
    }

    public onEmailKeyUp(){
        this.emailState = TcUser.isValidEmail(this.tmpUser.email) ? 'VALIDATING' : 'INVALID';
        clearTimeout(this.typingEmailTimer);
        new Promise((resolve, reject) => {
            this.typingEmailTimer = setTimeout(()=>{resolve(true);}, this.doneTypingEmailInterval);
        }).then((e)=>{
            if(TcUser.isValidEmail(this.tmpUser.email))
                this.checkEmail();
        });
    }

    public onEmailKeyDown(){
        clearTimeout(this.typingEmailTimer);
    }

    private checkEmail(){
        this.userService.getValidEmail(this.tmpUser.email).subscribe((isValid) => {
            this.emailState = isValid ? 'FREE' : 'TAKEN';
        });
    }

    public compareEmail(email){
        return (this.tmpUser.email && this.authService.currentUser.email) && this.tmpUser.email.toLowerCase().replace(/\s/g, '') === this.authService.currentUser.email.toLowerCase().replace(/\s/g, '');
    }

    public updateEmail(){
        this.isUpdatingEmail  = true;
        this.userService.getValidEmail(this.tmpUser.email).subscribe((isValid) => {
            if(!isValid)
                return this.cancelUpdateEmail();
            let user = TcUser.createFormJson({_id: this.tmpUser._id, email: this.tmpUser.email});
            this.userService.putUser(user).subscribe((userResponse) => {
                this.tmpUser.email = userResponse.email;
                this.authService.currentUser.email = userResponse.email;
                this.authService.currentUser.emailConfirmed = false;
                this.updateEmailIntent = false;
                this.emailState  = 'UPDATED';
                this.isUpdatingEmail = false;
                window.analytics.track('Updated email');
            });
        });
    }

    public onUsernameKeyUp(){
        this.usernameState = TcUser.isValidUsername(this.tmpUser.username) ? 'VALIDATING' : 'INVALID';
        clearTimeout(this.typingUsernameTimer);
        new Promise((resolve, reject) => {
            this.typingUsernameTimer = setTimeout(()=>{resolve(true);}, this.doneTypingUsernameInterval);
        }).then((e)=>{
            if(TcUser.isValidUsername(this.tmpUser.username))
                this.checkUsername();
        });
    }

    public onUsernameKeyDown(){
        clearTimeout(this.typingUsernameTimer);
    }

    private checkUsername(){
        this.userService.getValidUsername(this.tmpUser.username).subscribe((isValid) => {
            this.usernameState = isValid ? 'FREE' : 'TAKEN';
        });
    }

    public updateUsername(){
        this.isUpdatingUsername = true;
        this.userService.getValidUsername(this.tmpUser.username).subscribe((isValid) => {
            if(!isValid)
                return this.cancelUpdateUsername();
            let user = TcUser.createFormJson({_id: this.tmpUser._id, username: this.tmpUser.username});
            this.userService.putUser(user).subscribe((userResponse) => {
                this.tmpUser.username = userResponse.username;
                this.authService.currentUser.username = userResponse.username;
                this.updateUsernameIntent = false;
                this.isUpdatingUsername = false;
                window.analytics.track('Updated username');
            });
        });
    }

    public updateLanguage(){
        this.isUpdatingLanguage = true;
        var tmpThis = this;
        setTimeout(function(){
            let user = TcUser.createFormJson({_id: tmpThis.tmpUser._id, language: tmpThis.tmpUser.language});
            tmpThis.userService.putUser(user).subscribe((userResponse) => {
                tmpThis.tmpUser.language = userResponse.language;
                tmpThis.authService.currentUser.language = userResponse.language;
                tmpThis.t.loadLanguage(userResponse).then((res) => {
                    tmpThis.isUpdatingLanguage = false;
                });
            });
        },100);
    }

    public onAvatarFileChange(event) {
        this.isUploadingAvatar = true;
        this.imgUploadService.tryUploadAndGetImage(event, TcImage.getTypes().AVATAR).subscribe(image => {
            if(image && this.updateGeneralInfoIntent)
                this.tmpUser._avatar = image;
            this.isUploadingAvatar = false;
        });
    }

    public updateGeneralInfo() {
        if(this.isUploadingAvatar)
            return;
        this.userService.getValidUsername(this.tmpUser.username).subscribe((isValid) => {
            if(!isValid)
                return;
        });
        this.isUpdadingGeneralInfo = true;

        let user = new TcUser();
        user._id = this.tmpUser._id;
        user.name = this.tmpUser.name;
        user.username = this.tmpUser.username;
        user.bio = this.tmpUser.bio;
        if(this.tmpUser._avatar)
            user._avatar = this.tmpUser._avatar;

            this.userService.putUser(user).subscribe((userResponse) => {
                this.authService.currentUser.name = userResponse.name;
                this.authService.currentUser.bio = userResponse.bio;
                if(this.tmpUser._avatar)
                    this.authService.currentUser._avatar = this.tmpUser._avatar;
                this.tmpUser.name = userResponse.name;
                this.tmpUser.bio = userResponse.bio;
                this.tmpUser._avatar = null;
                // this.updateGeneralInfoIntent = false;
                this.isUpdadingGeneralInfo = false;
                window.analytics.track('Updated infos');
            }, (err) => {
                console.log('Sorry something went wrong while updating your general info');
                this.isUpdadingGeneralInfo = false;
                this.cancelUpdateGeneralInfo();
            });
    }

    public linkAccount(strategy: string){
         window.location.href = 'auth/' + strategy + '?next=' + encodeURIComponent('/'+this.authService.currentUser.username);
    }

    public unlinkAccount(type: string){
        this.authService.putUnlink(type).subscribe((sucess) => {
            switch (type) {
                case 'FACEBOOK':
                    this.authService.currentUser.facebook = null;
                    break;
                case 'TWITTER':
                    this.authService.currentUser.twitter = null;
                    break;
                case 'GOOGLE':
                    this.authService.currentUser.google = null;
                    break;
            }
        });
    }

    public isUpdatePasswordFormValid(){
        return this.password && this.newPassword && this.newPasswordRepeat && this.newPassword.length > 2 && this.newPassword === this.newPasswordRepeat;
    }

    public isSetPasswordFormValid(){
        return this.newPassword && this.newPasswordRepeat && this.newPassword.length > 2 && this.newPassword === this.newPasswordRepeat;
    }

    public updatePassword(){
        if(!this.isUpdatePasswordFormValid())
            return;
        this.isUpdatingPassword = true;
        this.authService.putPasswordUpdate(this.password, this.newPassword).subscribe((response) => {
            this.password = '';
            this.newPassword = '';
            this.newPasswordRepeat = '';
            this.passwordUpdateState = 'SUCCESS';
            this.isUpdatingPassword = false;
        }, (err) => {
            this.passwordUpdateState = 'FAILED';
            this.isUpdatingPassword = false;
        });
    }

    public setPassword(){
        if(!this.isSetPasswordFormValid())
            return;
        this.isUpdatingPassword = true;
        this.authService.putPasswordUpdate('none', this.newPassword).subscribe((response) => {
            this.password = '';
            this.newPassword = '';
            this.newPasswordRepeat = '';
            this.passwordUpdateState = 'SUCCESS';
            this.authService.currentUser.local.active = true;
            this.isUpdatingPassword = false;
        }, (err) => {
            this.passwordUpdateState = 'FAILED';
            this.isUpdatingPassword = false;
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { TcAuthService }     from '../tc-auth/tc-auth.service';
import { TcLanguageService } from '../tc-language/tc-language.service';
import { TcHeaderService }   from '../tc-header/tc-header.service';
import { TcUser }            from '../tc-user/tc-user.class';
import { TcUserService }     from '../tc-user/tc-user.service';

declare var window: any;

@Component({
	selector: 'tc-footer',
    templateUrl: './tc-footer.component.html',
    styleUrls: ['tc-footer.component.scss']
})

export class TcFooterComponent implements OnInit {

	public isUpdatingLanguage: boolean;
	public tmpUser: TcUser;

    constructor(public headerService: TcHeaderService, public t: TcLanguageService, public authService: TcAuthService, public userService: TcUserService, public router: Router){
   		this.authService.getAuthInitializedEmitter().subscribe((value) => {
   			if(this.authService.isLoggedIn){
            	this.tmpUser = TcUser.createFormJson(this.authService.currentUser);
   				this.tmpUser._avatar = null;
   			}
        })
    }

    ngOnInit(){
    }

    public updateLanguage(){
        this.isUpdatingLanguage = true;
        var tmpThis = this;
        if(this.authService.isLoggedIn){
        	this.tmpUser = TcUser.createFormJson(this.authService.currentUser);
	        setTimeout(function(){
	            let user = TcUser.createFormJson({_id: tmpThis.tmpUser._id, language: tmpThis.t.unsafeCurrentLanguage});
	            tmpThis.userService.putUser(user).subscribe((userResponse) => {
	                tmpThis.tmpUser.language = userResponse.language;
	                tmpThis.authService.currentUser.language = userResponse.language;
	                tmpThis.t.loadLanguage(userResponse).then((res) => {
	                    tmpThis.isUpdatingLanguage = false;
	                });
				});
				window.analytics.track('Changed language', {
					lang: tmpThis.t.unsafeCurrentLanguage
					// TODO maybe add old lang?
                });
	        },100);
	    }else{
	    	setTimeout(function(){
		    	tmpThis.t.updateLanguage(tmpThis.t.unsafeCurrentLanguage).then((res) => {
		            tmpThis.isUpdatingLanguage = false;
		        });
		    }, 100);
	    }
    }
}

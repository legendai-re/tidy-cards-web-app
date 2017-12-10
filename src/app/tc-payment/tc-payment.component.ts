import { Component, OnInit, HostListener } from '@angular/core';
import { TcPaymentService } from './tc-payment.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'tc-payment',
    templateUrl: './tc-payment.component.html'
    //styleUrls: ['./make-payment.component.scss']
})

export class TcPaymentComponent implements OnInit {
    handler: any;
    inputAmount = null;
    amount = 500;
    paidSuccess = false;
    processing = false;

    constructor(private paymentService: TcPaymentService ) { }
    ngOnInit() {
        this.handler = StripeCheckout.configure({
            key: environment._stripeKey,
            image: 'assets/img/favicon.png',
            locale: 'auto',
            currency: 'eur',
            token: token => {
                this.processing = true;
                this.paymentService.postPayment(token, this.amount).subscribe((result) => {
                    var res: any;
                    res = result;
                    if(res.success)
                        this.paidSuccess = true;
                    this.processing = false;
                }, (err) => {
                    this.processing = false;
                })
            }
        });
    }

    handlePayment() {
        if(!this.inputAmount)
            this.amount = 500;
        else
            this.amount = this.inputAmount*100;
        this.handler.open({
            name: 'Help TidyCards',
            excerpt: 'Deposit Funds to Account',
            amount: this.amount
        });
    }

    @HostListener('window:popstate')
        onPopstate() {
            this.handler.close()
        }
}
import {Component} from '@angular/core';
import {BaseComponent} from 'backlive/component/shared';

import {AppService} from 'backlive/service';

@Component({
    selector: 'app-faq',
    templateUrl: ''
})
export class FaqComponent extends BaseComponent {
    constructor (appService:AppService) {
        super(appService);
    }
}
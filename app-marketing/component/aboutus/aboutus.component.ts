import {Component} from '@angular/core';
import {BaseComponent} from 'backlive/component/shared';

import {AppService} from 'backlive/service';

@Component({
    selector: 'about-us',
    templateUrl: ''
})
export class AboutUsComponent extends BaseComponent {
    constructor (appService:AppService) {
        super(appService);
    }
}
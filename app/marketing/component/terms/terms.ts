import {Component} from 'angular2/angular2';
import {BaseComponent} from '../../../config/imports/shared';

import {AppService} from '../../../config/imports/service';

@Component({
    selector: 'app-terms',
    templateUrl: ''
})
export class TermsComponent extends BaseComponent {
    constructor (appService:AppService) {
        super(appService);
    }
}
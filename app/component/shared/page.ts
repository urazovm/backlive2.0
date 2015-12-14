import {Component, CORE_DIRECTIVES} from 'angular2/angular2';
import {BaseComponent} from './base';

import {AppService} from '../../config/imports/service';

import {Event} from '../../service/model/event';
import {Animation} from '../../utility/animation';

@Component({
    directives: [CORE_DIRECTIVES]
})
export class PageComponent extends BaseComponent {
    pageAnimation: string;
    animationType: string = Animation.Rotate3d;
    
    constructor (appService: AppService, autoAnimateIn: boolean = true, defaultAnimation: string = Animation.FadeIn) {
        super(appService)

        this.appService.clearEvent(Event.SearchKeyUp);
        this.appService.notify(Event.SlidingNavVisible, false);
        
        this.animationType = defaultAnimation;
        this.pageAnimation = Animation.hide(this.animationType);
        
        if(autoAnimateIn) {
            this.show();
        }
        else {
            this.appService.notify(Event.PageLoading, true);
        }
    }
    
    show() {
        setTimeout(() => {
            this.pageAnimation = this.animationType;
            this.appService.notify(Event.PageLoading, false);
        });
    }
}
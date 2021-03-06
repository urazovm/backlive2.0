import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Path} from 'backlive/config';

import {BaseComponent} from 'backlive/component/shared';

import {AppService} from 'backlive/service';
import {AppEvent} from 'backlive/service/model';

@Component({
    selector: 'search-bar',
    templateUrl: Path.ComponentView('shared/search-bar'),
    directives: []
})
export class SearchBarComponent extends BaseComponent  {
    @Input() placeholder: string;
    @Input() throttle = 300;
    @Output() clear:  EventEmitter<any> = new EventEmitter();
    previousKey: string;
    searchKey: string;
    typingInterval: any = null;
    
    constructor (appService: AppService) {
        super(appService);
        this.searchKey = "";
        this.placeholder = "search by ticker or company";
    }
    
    search() {
        if(this.typingInterval == null) {
            this.previousKey = this.searchKey;
            this.typingInterval = setInterval(() => this.onStopTyping(), this.throttle);
        }
    }
    
    private onStopTyping() {
        if(this.previousKey == this.searchKey) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
            
            if(this.searchKey.length > 1 || this.searchKey.length == 0) {
                this.appService.notify(AppEvent.SearchKeyUp, this.searchKey);
            }
        }
        else {
            this.previousKey = this.searchKey;
        }
    }
    
    clearSearch() {
        this.searchKey = "";
        this.clear.emit(this.searchKey);
    }
}
import {Component, CORE_DIRECTIVES, ElementRef, ComponentRef, DynamicComponentLoader, NgZone} from 'angular2/angular2';
import {BaseComponent} from '../shared/base';

import {AppService} from '../../service/app';
import {Event} from '../../model/event';

@Component({
    selector: 'sliding-nav',
    templateUrl: '/view/navigation/sliding-nav.html',
    directives: [CORE_DIRECTIVES]
})
export class SlidingNavComponent extends BaseComponent {
    items: NavItem[];
    componentLoader: DynamicComponentLoader;
    elementRef: ElementRef;
    ngZone: NgZone;
    
    activeComponent: ComponentRef;
    isActive: boolean = false;
    isVisible: boolean = false;
    
    constructor(appService:AppService, componentLoader: DynamicComponentLoader, elementRef: ElementRef, ngZone: NgZone) {
        super(appService);
        this.componentLoader = componentLoader;
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.items = [];
        
        //this.appService.clearEvent(Event.SlidingNavItems);
        this.appService.subscribe(Event.SlidingNavItems, (items: NavItem[]) => this.updateItems(items));
    }
    
    updateItems(items: NavItem[]) {
        //this.items = items
        this.isActive = false;
        this.appService.notify(Event.SlidingNavVisible, true);
        
        //angular bug exists where classes from previous items do not get removed, so instead update each item one by one
        //TODO: remove if this bug gets fixed in later versions
        items.forEach((item, i) => {
            if(this.items[i]) {
                delete this.items[i].component;
                delete this.items[i].onClick;
                delete this.items[i].isActive;
                
                for(var key in item) {
                    this.items[i][key] = item[key];
                }
            }
            else {
                this.items.push(item);
            }
        });
        
        if(this.items.length > items.length) {
            this.items.splice(items.length, this.items.length - items.length);
        }
    }
    
    showSideBar(navItem: NavItem) {
        var isActive = !navItem.isActive;

        this.items.forEach(item => {
            item.isActive = false;
        });

        if(this.activeComponent != null) {
            this.activeComponent.dispose();
        }
        
        navItem.isActive = isActive;
        
        if(navItem.component) {
            this.isActive = isActive;
            
            //dynamically load selected nav item's component, can remove null check once all nav items have a component set (which should be required)
            if(isActive) {
                var self = this;
                
                this.componentLoader.loadIntoLocation(navItem.component, this.elementRef, 'component').then(function (componentRef) {
                    self.activeComponent = componentRef;
                });
            }
        }
        else {
            navItem.isActive = true;
            this.isActive = false;
            
            if(navItem.onClick) {
                navItem.onClick();
            }
        }
    }
}

class NavItem {
    icon: string;
    isActive: boolean;
    component: any; //either component or onClick should be set, component takes precendence
    onClick: Function;
}
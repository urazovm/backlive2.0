import {Component, Type, ComponentRef, DynamicComponentLoader, EventEmitter, ViewChild, ViewContainerRef} from '@angular/core';
import {Path} from 'backlive/config';
import {Common} from 'backlive/utility';
import {PlatformUI} from 'backlive/utility/ui';

import {BaseComponent} from '../base.component';

import {AppService} from 'backlive/service';

import {AppEvent} from 'backlive/service/model';

@Component({
    selector: 'ui-modal',
    templateUrl: Path.ComponentView('shared/modal'),
    styleUrls: [Path.ComponentStyle('shared/modal')],
    directives: []
})
export class ModalComponent extends BaseComponent {
    id: string = 'uiModal';
    options: ModalOptions;
    componentLoader: DynamicComponentLoader;
    platformUI: PlatformUI

    componentRefs: ComponentRef<any>[] = [];
    
    @ViewChild('modalbody', {read: ViewContainerRef}) modalbodyRef: ViewContainerRef;
    @ViewChild('modalfooter', {read: ViewContainerRef}) modalfooterRef: ViewContainerRef;

    constructor (appService:AppService, componentLoader: DynamicComponentLoader, platformUI: PlatformUI) {
        super(appService);
        this.componentLoader = componentLoader;
        this.platformUI = platformUI;

        this.options = { body: '' };

        this.subscribeEvent(AppEvent.OpenModal, (options: ModalOptions) => this.open(options));
        this.subscribeEvent(AppEvent.CloseModal, () => this.close());
    }

    open (options: ModalOptions) {
        this.options = options;

        if(!this.options.title) {
            this.options.title = 'BackLive';
        }

        this.componentRefs.forEach(componentRef => {
            componentRef.destroy();
        });

        if(options.body && !this.isString(options.body)) {
            this.loadComponent(<Type> options.body, this.modalbodyRef, options.model);
        }

        if(options.footer && !this.isString(options.footer)) {
            this.loadComponent(<Type> options.footer, this.modalfooterRef, options.model);
        }

        this.platformUI.query('#' + this.id).modal('show');
    }

    close () {
        this.platformUI.query('#' + this.id).modal('hide');
    }

    loadComponent(component: Type, viewContainerRef: ViewContainerRef, model: {}) {
        this.componentLoader.loadNextToLocation(component, viewContainerRef).then(componentRef => {
            if(model) {
                for(var key in model) {
                    componentRef.instance[key] = model[key];
                }
            }
            
            for(var key in componentRef.instance) {
                if(componentRef.instance[key] instanceof EventEmitter) {
                    componentRef.instance[key].subscribe(this.fireEvent(key));
                }
            }
            
            if(componentRef.instance.ngOnInit) {
                componentRef.instance.ngOnInit();
            }
            else if(componentRef.instance.ngOnChanges) {
                componentRef.instance.ngOnChanges();
            }
            
            this.componentRefs.push(componentRef);
        });
    }

    submit () {
        if(this.options.onSubmit) {
            this.options.onSubmit();
            this.close();
        }
    }
    
    fireEvent(eventKey: string) {
        return ($event) => {
            if(this.options.eventHandlers && this.options.eventHandlers[eventKey]) {
                this.options.eventHandlers[eventKey]($event);
            }
        }
    }
    
    isString(str: any) {
        return Common.isString(str);
    }
    
    onBodyClick() {
        if(this.options.onBodyClick) {
            this.options.onBodyClick();
            this.close();
        }
    }
}

export interface ModalOptions {
    title?: string;
    icon?: string;
    body: string | Type;
    footer?: string | Type;
    model?: {};
    onSubmit?: Function;
    eventHandlers?: { [key:string]: Function };
    onBodyClick?: Function;
}

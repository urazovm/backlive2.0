import {Component} from '@angular/core';

@Component({
    selector: 'ajax-loader',
    template: `<div><img src="/Content/images/ajax-spinner.gif" alt="loading" /></div>`
})
export class AjaxLoaderComponent {
    constructor () {}
}
import { Component, EventEmitter, OnInit, ElementRef, Output } from '@angular/core';
import { AppConfig } from '../../app.config';
import { Dashboard } from "../../dashboard/dashboard.component";
import { Router } from "@angular/router";
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: '[navbar]',
    templateUrl: './navbar.template.html'
})
export class Navbar implements OnInit {
    @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
    $el: any;
    config: any;
    private searchingFor = '-1';

    private name;
    private lastname;

    constructor(el: ElementRef, config: AppConfig, private router: Router) {
        this.$el = jQuery(el.nativeElement);
        this.config = config.getConfig();
    }

    toggleSidebar(state): void {
        this.toggleSidebarEvent.emit(state);
    }

    ngOnInit(): void {
        this.name = JSON.parse(localStorage.getItem("user")).name;
        this.lastname = JSON.parse(localStorage.getItem("user")).lastname;
        this.$el.find('.input-group-addon + .form-control').on('blur focus', function (e): void {
            jQuery(this).parents('.input-group')
                [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
        });
    }

    startSearch(value) {
        if (value == "") return;
        if (this.router.url.indexOf("/app/dashboard") < 0) {
            Dashboard.fromSearch = {value: value.trim(), by: this.searchingFor};
            this.router.navigate(['/app/dashboard'])
        } else {
            Dashboard.startSearchEvent.emit({value: value.trim(), by: this.searchingFor});
        }
    }

    getSearchingWord() {
        switch (this.searchingFor) {
            case '-1'://dni
                return "cédula";
            case '0'://name
                return "nombre";
            case '1'://lastname
                return "apellido";
            case '2'://hnumber
                return "historia";
        }
    }
}

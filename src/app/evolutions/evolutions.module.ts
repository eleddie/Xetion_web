import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';
import { EvolutionsPage } from './evolutions.component.ts';

import { TabViewModule } from 'primeng/primeng';
import { TextMaskModule } from "angular2-text-mask";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/components/calendar/calendar";

export const routes = [
    {path: '', component: EvolutionsPage, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TabViewModule,
        TextMaskModule,
        FormsModule,
        CalendarModule,
    ],
    declarations: [EvolutionsPage]
})
export class EvolutionsModule {
    static routes = routes;
}

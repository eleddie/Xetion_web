import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard.component.ts';
import { Widget } from '../layout/widget/widget.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { SelectPatientComponent } from "./select-patient.component";
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ProfilePictureComponent } from "../profile-picture/profile-picture.component";


export const routes = [
    {path: '', component: Dashboard, pathMatch: 'full'}
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TextMaskModule,
        Ng2Bs3ModalModule,
    ],
    declarations: [
        Dashboard,
        Widget,
        SelectPatientComponent,
        ProfilePictureComponent,

    ]
})
export class DashboardModule {
    static routes = routes;
}

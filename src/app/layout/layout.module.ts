import 'jquery-slimscroll';

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { TooltipModule } from 'ng2-bootstrap';

import { ROUTES }       from './layout.routes';

import { Layout } from './layout.component';
import { Sidebar } from './sidebar/sidebar.component';
import { Navbar } from './navbar/navbar.component';
import { SearchPipe } from './pipes/search.pipe';
import { NotificationLoad } from './notifications/notifications-load.directive';
import { Notifications } from './notifications/notifications.component';
import { GrowlModule, OverlayPanelModule } from 'primeng/primeng';


@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot(),
        ROUTES,
        FormsModule,
        GrowlModule,
        OverlayPanelModule,
    ],
    declarations: [
        Layout,
        Sidebar,
        Navbar,
        SearchPipe,
        Notifications,
        NotificationLoad,
    ]
})
export class LayoutModule {
}

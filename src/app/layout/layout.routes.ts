import { Routes, RouterModule }  from '@angular/router';
import { Layout } from './layout.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: Layout, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
    { path: 'clinical-data', loadChildren: '../clinical-data/clinical-data.module#ClinicalDataModule' },
    { path: 'evolutions', loadChildren: '../evolutions/evolutions.module#EvolutionsModule' },
  ]}
];

export const ROUTES = RouterModule.forChild(routes);

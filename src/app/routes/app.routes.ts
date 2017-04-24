import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServerListComponent } from '../components/server/server-list/server-list.component';
import { ClientListComponent } from '../components/client/client-list/client-list.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'servers' },
    { path: 'servers', component: ServerListComponent },
    { path: 'clients', component: ClientListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RemerciementComponent } from './remerciement/remerciement.component';
import { AproposComponent } from './apropos/apropos.component';
import { ContactComponent } from './contact/contact.component';
import { NotfoundsComponent } from './notfounds/notfounds.component';



const routes: Routes = [
	  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    { path: 'apropos', component: AproposComponent },
    { path: 'accueil', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'remerciement', component: RemerciementComponent },
    { path: '**', component: NotfoundsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [AproposComponent, HomeComponent, ContactComponent, RemerciementComponent, NotfoundsComponent]
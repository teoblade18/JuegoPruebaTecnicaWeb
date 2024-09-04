import { Routes } from '@angular/router';
import { PiedraPapelTijeraComponent } from './piedra-papel-tijera/piedra-papel-tijera.component';

export const routes: Routes = [
    { path: '', redirectTo: '/piedra-papel-tijera', pathMatch: 'full' },
    { path: 'piedra-papel-tijera', component: PiedraPapelTijeraComponent },
    { path: '**', redirectTo: '/piedra-papel-tijera' }
];
import { Routes } from '@angular/router';
import PokemonPage from './pokemon/pages/pokemon-page/pokemon-page';
import { PokemonDetail } from './pokemon/pages/pokemon-detail/pokemon-detail';

export const routes: Routes = [
    {
        path: 'pokemon',
        component: PokemonPage,
    },
    {
        path: '',
        redirectTo: 'pokemon',
        pathMatch: 'full'
    },
    {
        path: 'pokemon/:id',
        component: PokemonDetail
        // loadComponent: () => import('./pokemon/pages/pokemon-detail/pokemon-detail').then(m => m.PokemonDetail)
    },
    {
        path: '**',
        redirectTo: 'pokemon'
    }
];

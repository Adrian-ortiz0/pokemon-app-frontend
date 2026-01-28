// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { forkJoin, map, Observable, switchMap } from 'rxjs';
// import { PokemonDetailInterface, PokemonListResponse, PokemonWithSprite } from '../interfaces/pokemon-list.interface';

// const API_URL = 'https://pokeapi.co/api/v2/pokemon';

// @Injectable({providedIn: 'root'})
// export class PokemonService {

    
//     private http = inject(HttpClient);

//   getAllPokemon(offset: number = 0, limit: number = 20): Observable<PokemonListResponse>{
//     const url = `${API_URL}?offset=${offset}&limit=${limit}`;
//     return this.http.get<PokemonListResponse>(url);
//   }
//   getPokemonDetails(url: string) {
//   return this.http.get<{sprites: {front_default: string}}>(url);
// }

// getPokemonListWithSprites(limit = 20, offset = 0): Observable<PokemonWithSprite[]> {
//     return this.getAllPokemon(offset, limit).pipe(
//       switchMap(res => {
//         const requests = res.results.map(p =>
//           this.getPokemonDetails(p.url).pipe(
//             map(details => ({
//               id: p.url.split('/').filter(Boolean).pop() || '0',
//               name: p.name,
//               url: p.url,
//               sprite: details.sprites.front_default || null
//             }))
//           )
//         );
//         return forkJoin(requests);
//       })
//     );
//   }
//   getPokemonById(id: string | number): Observable<PokemonDetailInterface> {
//     return this.http.get<PokemonDetailInterface>(`${API_URL}/${id}`);
//   }

//   getPokemonByName(name: string): Observable<any> {
//     const url = `${API_URL}/${name.toLowerCase()}`;
//     return this.http.get(url);
//   }
// }
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PokemonDetailInterface, PokemonListResponse, PokemonWithSprite } from '../interfaces/pokemon-list.interface';

const API_URL = 'https://localhost:7274/api/pokemon';

@Injectable({providedIn: 'root'})
export class PokemonService {
    private http = inject(HttpClient);

  getAllPokemon(offset: number = 0, limit: number = 20): Observable<PokemonListResponse>{
    const url = `${API_URL}?offset=${offset}&limit=${limit}`;
    return this.http.get<PokemonListResponse>(url);
  }

  getPokemonById(id: string | number): Observable<PokemonDetailInterface> {
    return this.http.get<PokemonDetailInterface>(`${API_URL}/${id}`);
  }

  getPokemonByName(name: string): Observable<PokemonDetailInterface> {
    const url = `${API_URL}/name/${name.toLowerCase()}`;
    return this.http.get<PokemonDetailInterface>(url);
  }

  getAllPokemonNames(limit: number = 1500): Observable<{name: string, url: string}[]> {
    return this.http.get<{name: string, url: string}[]>(`${API_URL}/names?limit=${limit}`);
  }

  searchPokemon(term: string, maxResults: number = 20): Observable<PokemonWithSprite[]> {
    return this.http.get<PokemonWithSprite[]>(`${API_URL}/search?term=${term}&maxResults=${maxResults}`);
  }

  getPokemonDetails(url: string) {
    return this.http.get<{sprites: {front_default: string}}>(url);
  }
}
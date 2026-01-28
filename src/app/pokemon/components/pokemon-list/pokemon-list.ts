import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { debounceTime, forkJoin, map, Subject } from 'rxjs';
import { PokemonWithSprite } from '../../interfaces/pokemon-list.interface';

@Component({
  selector: 'app-pokemon-list',
  imports: [TitleCasePipe, UpperCasePipe, RouterLink],
  templateUrl: './pokemon-list.html',
})
export class PokemonList {
  pokemonList = signal<PokemonWithSprite[]>([]);
  searchResults = signal<PokemonWithSprite[]>([]);
  allPokemonNames = signal<{ name: string; url: string }[]>([]);

  offset = signal(0);
  limit = signal(20);

  isSearching = signal(false);
  isLoadingSearch = signal(false);

  searchTerm = input<string>('');

  private pokemonService = inject(PokemonService);

  currentPage = computed(() => Math.floor(this.offset() / this.limit()) + 1);

  displayedPokemon = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return this.pokemonList();

    const localMatches = this.pokemonList().filter((p) =>
      p.name.toLowerCase().includes(term),
    );

    return localMatches.length > 0 ? localMatches : this.searchResults();
  });

  constructor() {
    this.loadInitialData();
    this.handleSearch();
  }

  private loadInitialData() {
    this.loadPokemon();
    this.loadAllPokemonNames();
  }

  private handleSearch() {
    effect((onCleanup) => {
      const term = this.searchTerm().toLowerCase().trim();

      if (!term) {
        this.isSearching.set(false);
        this.searchResults.set([]);
        this.isLoadingSearch.set(false);
        return;
      }

      this.isSearching.set(true);

      const localMatches = this.pokemonList().filter((p) =>
        p.name.toLowerCase().includes(term),
      );

      if (localMatches.length > 0) {
        this.searchResults.set([]);
        this.isLoadingSearch.set(false);
        return;
      }

      this.isLoadingSearch.set(true);

      const t = setTimeout(() => {
        this.searchInAPI(term);
      }, 500);

      onCleanup(() => clearTimeout(t));
    });
  }

  private loadAllPokemonNames() {
    this.pokemonService.getAllPokemon(0, 1500).subscribe((res) => {
      this.allPokemonNames.set(res.results);
    });
  }

  private loadPokemon() {
    this.pokemonService
      .getAllPokemon(this.offset(), this.limit())
      .subscribe((res) => {
        const requests = res.results.map((p) =>
          this.pokemonService.getPokemonDetails(p.url).pipe(
            map((detail) => ({
              id: p.url.split('/').filter(Boolean).pop() ?? '0',
              name: p.name,
              url: p.url,
              sprite: detail.sprites.front_default ?? null,
            })),
          ),
        );

        forkJoin(requests).subscribe((pokemonWithSprites) => {
          this.pokemonList.set(pokemonWithSprites);
        });
      });
  }

  private searchInAPI(term: string) {
    const matches = this.allPokemonNames()
      .filter((p) => p.name.includes(term))
      .slice(0, 20);

    if (matches.length === 0) {
      this.searchResults.set([]);
      this.isLoadingSearch.set(false);
      return;
    }

    const requests = matches.map((p) =>
      this.pokemonService.getPokemonDetails(p.url).pipe(
        map((detail) => ({
          id: p.url.split('/').filter(Boolean).pop() ?? '0',
          name: p.name,
          url: p.url,
          sprite: detail.sprites.front_default ?? null,
        })),
      ),
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoadingSearch.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isLoadingSearch.set(false);
      },
    });
  }
  nextPage() {
    if (!this.isSearching()) {
      this.offset.update((v) => v + this.limit());
      this.loadPokemon();
    }
  }

  prevPage() {
    if (this.offset() >= this.limit() && !this.isSearching()) {
      this.offset.update((v) => v - this.limit());
      this.loadPokemon();
    }
  }
}

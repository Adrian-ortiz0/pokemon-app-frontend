import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { debounceTime, forkJoin, map, Subject } from 'rxjs';
import { PokemonWithSprite } from '../../interfaces/pokemon-list.interface';

@Component({
  selector: 'app-pokemon-list',
  imports: [TitleCasePipe, UpperCasePipe, RouterLink],
  templateUrl: './pokemon-list.html',
})
export class PokemonList implements OnInit {
  pokemonList = signal<PokemonWithSprite[]>([]);
  searchResults = signal<PokemonWithSprite[]>([]);
  allPokemonNames = signal<{name: string, url: string}[]>([]); 
  nextUrl = signal<string | null>(null);
  offset = signal(0);
  limit = signal(20);
  isSearching = signal(false);
  isLoadingSearch = signal(false);

  searchTerm = input<string>('');

  private pokemonService = inject(PokemonService);
  private searchSubject = new Subject<string>();

  currentPage = computed(() => Math.floor(this.offset() / this.limit()) + 1);

  displayedPokemon = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    
    if (!term) {
      return this.pokemonList();
    }

    const localMatches = this.pokemonList().filter(p => 
      p.name.toLowerCase().includes(term)
    );

    if (localMatches.length > 0) {
      return localMatches;
    }

    return this.searchResults();
  });

  constructor() {
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(term => {
      if (term) {
        this.searchInAPI(term);
      }
    });

    effect(() => {
      const term = this.searchTerm().toLowerCase().trim();
      
      if (!term) {
        this.isSearching.set(false);
        this.searchResults.set([]);
        this.isLoadingSearch.set(false);
        return;
      }

      this.isSearching.set(true);

      const localMatches = this.pokemonList().filter(p => 
        p.name.toLowerCase().includes(term)
      );

      if (localMatches.length > 0) {
        this.searchResults.set([]);
        this.isLoadingSearch.set(false);
        return;
      }

      this.isLoadingSearch.set(true);
      this.searchSubject.next(term);
    });
  }

  ngOnInit(): void {
    this.loadPokemon();
    this.loadAllPokemonNames(); 
  }

  loadAllPokemonNames() {
    this.pokemonService.getAllPokemon(0, 1500).subscribe(res => {
      this.allPokemonNames.set(res.results);
    });
  }

  searchInAPI(term: string) {
    const termLower = term.toLowerCase();
    
    const matchingNames = this.allPokemonNames().filter(p => 
      p.name.includes(termLower)
    );

    if (matchingNames.length === 0) {
      this.searchResults.set([]);
      this.isLoadingSearch.set(false);
      return;
    }

    const limitedMatches = matchingNames.slice(0, 20);

    const detailRequests = limitedMatches.map(p =>
      this.pokemonService.getPokemonDetails(p.url).pipe(
        map(detail => ({
          id: p.url.split('/').filter(Boolean).pop() || '0',
          name: p.name,
          url: p.url,
          sprite: detail.sprites.front_default || null
        }))
      )
    );

    forkJoin(detailRequests).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoadingSearch.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isLoadingSearch.set(false);
      }
    });
  }

  loadPokemon() {
    this.pokemonService.getAllPokemon(this.offset(), this.limit())
      .subscribe(res => {
        const detailsRequests = res.results.map(p =>
          this.pokemonService.getPokemonDetails(p.url)
            .pipe(
              map(detail => ({
                id: p.url.split('/').filter(Boolean).pop() || '0',
                name: p.name,
                url: p.url,
                sprite: detail.sprites.front_default || null
              }))
            )
        );

        forkJoin(detailsRequests).subscribe(pokemonWithSprites => {
          this.pokemonList.set(pokemonWithSprites);
          this.nextUrl.set(res.next);
        });
      });
  }

  loadMore() {
    if (this.nextUrl() && !this.isSearching()) {
      this.offset.update(val => val + this.limit());
      this.loadPokemon();
    }
  }

  prevPage() {
    if (this.offset() >= this.limit() && !this.isSearching()) {
      this.offset.update(val => val - this.limit());
      this.loadPokemon();
    }
  }
}
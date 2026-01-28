import { Component, inject, input, signal, OnInit, effect } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { PokemonDetailInterface } from '../../interfaces/pokemon-list.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [TitleCasePipe,RouterLink],
  templateUrl: './pokemon-detail.html',
})
export class PokemonDetail {
  private pokemonService = inject(PokemonService);

  id = input.required<string>();

  pokemon = signal<PokemonDetailInterface | null>(null);
  loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.id();
      if (!id) return;

      this.loading.set(true);

      this.pokemonService.getPokemonById(id).subscribe({
        next: data => {
          this.pokemon.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.pokemon.set(null);
          this.loading.set(false);
        },
      });
    });
  }
}
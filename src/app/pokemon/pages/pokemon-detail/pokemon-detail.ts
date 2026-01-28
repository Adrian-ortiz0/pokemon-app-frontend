import { Component, inject, input, signal, OnInit } from '@angular/core';
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
export class PokemonDetail implements OnInit {
  private pokemonService = inject(PokemonService);

  id = input.required<string>(); 
  
  pokemon = signal<PokemonDetailInterface | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadPokemon();
  }

  loadPokemon() {
    this.pokemonService.getPokemonById(this.id()).subscribe({
      next: (data) => {
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        console.error("Error cargando el Pokémon");
      }
    });
  }
}
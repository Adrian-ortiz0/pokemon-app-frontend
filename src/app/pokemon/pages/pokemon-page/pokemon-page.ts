import { Component, signal } from '@angular/core';
import { TopMenu } from "../../components/top-menu/top-menu";
import { PokemonList } from "../../components/pokemon-list/pokemon-list";

@Component({
  selector: 'app-pokemon-page',
  imports: [TopMenu, PokemonList],
  templateUrl: './pokemon-page.html',
})
export default class PokemonPage {
  searchTerm = signal('');

  onSearchChange(newTerm: string) {
    this.searchTerm.set(newTerm);
  }
}
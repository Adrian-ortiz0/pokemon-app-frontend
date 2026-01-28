import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-top-menu',
  imports: [],
  templateUrl: './top-menu.html',
})
export class TopMenu {
  searchTerm = input('');
  searchTermChange = output<string>();

  term = signal('');

  onInput(value: string) {
    this.term.set(value);
    this.searchTermChange.emit(value);
  }
}
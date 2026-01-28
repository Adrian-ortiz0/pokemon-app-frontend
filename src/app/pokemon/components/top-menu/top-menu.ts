import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-top-menu',
  imports: [],
  templateUrl: './top-menu.html',
})
export class TopMenu {
  searchTerm = input<string>('');
  searchTermChange = output<string>();
  term = signal('');

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.term.set(value);
    this.searchTermChange.emit(value);
  }
}
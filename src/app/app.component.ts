import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./pokemon/pages/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'pokemon-app';
}

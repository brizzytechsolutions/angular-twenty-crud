import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavToolbar } from './layout/nav-toolbar/nav-toolbar';
import { SideBar } from './layout/side-bar/side-bar';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavToolbar, SideBar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Even the app title is a signal on this branch for consistency.
  protected readonly title = signal('Angular 22 Movies CRUD (Signals)');
}

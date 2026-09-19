import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-toolbar',
  imports: [RouterLink],
  templateUrl: './nav-toolbar.html',
  styleUrl: './nav-toolbar.scss',
})
export class NavToolbar {
  @Input() appTitle = 'Movies CRUD';
}

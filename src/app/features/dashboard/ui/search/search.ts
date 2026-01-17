import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './search.html',
  standalone: true,
  styleUrl: './search.scss',
})
export class Search {
}

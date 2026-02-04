import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../model/search.service';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { User } from '@app/entities/user/ui/user';

@Component({
  selector: 'app-search',
  imports: [MatFormFieldModule, User, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './search.html',
  standalone: true,
  styleUrl: './search.scss',
})
export class Search implements OnInit, OnDestroy {
  private readonly searchService = inject(SearchService);
  private subscription?: Subscription;

  protected searchForm = new FormGroup({
    search: new FormControl(''),
  });

  protected get isLoading() {
    return this.searchService.isLoading();
  }

  protected get error() {
    return this.searchService.error();
  }

  protected onUserClick(userId: string) {
    console.log(userId);
  }

  ngOnInit(): void {
    this.subscription = this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => !!value && value.trim().length > 0)
      )
      .subscribe((query) => {
        if (query) {
          this.searchService.searchUsers(query.trim()).subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected get users() {
    return this.searchService.users() || [];
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { UiStateService } from '../../core/service/ui-state.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    TranslateModule,
    MatButton,
    MatIcon,
    MatMiniFabButton,
    MatProgressSpinner,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  filteredOptions$!: Observable<string[]>;
  options: string[] = ['R', 'Re', 'Res', 'Rest', 'Resta', 'Restau', 'Restaur', 'Restaura', 'Restauran', 'Restaurant'];
  searchBarControl = new FormControl('');

  @Output() searchQuery = new EventEmitter<string>();

  constructor(private readonly uiStateService: UiStateService) {
    this.uiStateService.setShowBackButton(false);
  }

  ngOnInit() {
    this.filteredOptions$ = this.searchBarControl.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this.options.filter((option) => option.toLowerCase().includes((value || '').toLowerCase()))),
    );
  }

  submitSearch(): void {
    const query = this.searchBarControl.value;
    if (query != null) {
      this.emitSearchQuery(query);
    }
  }  

  emitSearchQuery(event: any): void {
    const query = event.target.value;
    console.log('Search query:', query);
    this.searchQuery.emit(query);
  }
}

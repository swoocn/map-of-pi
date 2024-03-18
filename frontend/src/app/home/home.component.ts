import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActionRowComponent } from './action-row/action-row.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ActionRowComponent, MapComponent, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent;

  passSearchQueryToMap(query: string): void {
    this.mapComponent.filterShops(query);
  }
}

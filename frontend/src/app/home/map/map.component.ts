import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Map, marker, Marker } from 'leaflet';
import { GeolocationService } from '../../core/service/geolocation.service';
import { SnackService } from '../../core/service/snack.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  layer?: Marker;
  map!: Map;
  options;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly geolocationService: GeolocationService,
    private readonly snackService: SnackService,
  ) {
    this.options = this.geolocationService.getMapOptions();
    this.geolocationService.geolocationTriggerEvent$.subscribe(() => {
      this.locateMe();
    });
  }

  onMapReady(map: Map): void {
    this.map = map;
  }

  locateMe(): void {
    this.geolocationService
      .getCurrentPosition()
      .pipe(take(1))
      .subscribe({
        next: (coords: GeolocationCoordinates) => {
          this.layer = marker([coords.latitude, coords.longitude], { icon: this.geolocationService.getMarkerIcon() })
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            .openPopup();
          this.map.flyTo([coords.latitude, coords.longitude], 15);
          this.cdr.detectChanges();
        },
        error: (error: string) => {
          this.snackService.showError(`Geolocation error: ${error}`);
        },
      });
  }
}

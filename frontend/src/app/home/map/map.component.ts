import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Map, marker, Layer } from 'leaflet';
import { GeolocationService } from '../../core/service/geolocation.service';
import { SnackService } from '../../core/service/snack.service';
import { take } from 'rxjs';
import { ICoordinate, dummyCoordinates } from '../../core/model/business';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MapComponent {
  layer?: Layer;
  map!: Map;
  options;

  coordinates = dummyCoordinates;
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
    // Add all coordinates to the map on component initialization
    this.addAllCoordinatesToMap();
  }

  locateMe(): void {
    this.geolocationService
      .getCurrentPosition()
      .pipe(take(1))
      .subscribe({
        next: (coords: GeolocationCoordinates) => {
          // Add user's location marker
          this.layer = marker([coords.latitude, coords.longitude], {
            icon: this.geolocationService.getUserMarkerIcon(),
          })
            .bindPopup('my name here is soleil')
            .openPopup();

          this.map.addLayer(this.layer);
          this.map.flyTo([coords.latitude, coords.longitude], 15);

          // Add all other coordinates to the map
          this.addAllCoordinatesToMap();

          this.cdr.detectChanges();
        },
        error: (error: string) => {
          this.snackService.showError(`Geolocation error: ${error}`);
        },
      });
  }

  addAllCoordinatesToMap(): void {
    this.coordinates.forEach((coordinate: ICoordinate) => {
      const markerLayer = marker([coordinate.lat, coordinate.long], {
        icon: this.geolocationService.getMarkerIcon(),
      })
        .bindPopup('Your custom popup content here')
        .addTo(this.map);
    });
  }
}

import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Icon, icon, latLng, MapOptions, tileLayer } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly initZoomLevel = 12;
  private readonly initCoords = latLng(28.1, -15.45);
  private readonly geolocationTrigger = new Subject<void>();
  private readonly maxZoomLevel = 18;
  private readonly tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  readonly geoLoading = signal<boolean>(false);
  readonly geolocationTriggerEvent$ = this.geolocationTrigger.asObservable();

  triggerGeolocation(): void {
    this.geolocationTrigger.next();
  }

  getCurrentPosition(): Observable<GeolocationCoordinates> {
    this.geoLoading.set(true);
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            observer.next(position.coords);
            observer.complete();
            this.geoLoading.set(false);
          },
          (error: GeolocationPositionError) => {
            observer.error(error?.message);
            this.geoLoading.set(false);
          },
        );
      } else {
        observer.error('Geolocation is not available in this browser.');
        this.geoLoading.set(false);
      }
    });
  }

  getMapOptions(): MapOptions {
    return {
      layers: [
        tileLayer(this.tileLayer, {
          maxZoom: this.maxZoomLevel,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
      zoom: this.initZoomLevel,
      center: this.initCoords,
    };
  }

  getMarkerIcon(): Icon {
    return icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
    });
  }
}

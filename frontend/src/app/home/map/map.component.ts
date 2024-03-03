import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Map, marker, Layer } from 'leaflet';
import { GeolocationService } from '../../core/service/geolocation.service';
import { SnackService } from '../../core/service/snack.service';
import { take } from 'rxjs';
import { ICoordinate, dummyCoordinates } from '../../core/model/business';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ShopService } from '../../core/service/shop.service';
import axios from 'axios';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, RouterModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MapComponent implements OnInit {
  layer?: Layer;
  map!: Map;
  options;
  id: string = '65e2d67a38e1e60afd74378d';
  navigator: Router = inject(Router);
  showPopup: boolean = false;
  allShops: any[] = [];

  coordinates = dummyCoordinates;
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly geolocationService: GeolocationService,
    private readonly snackService: SnackService,
    private shopService: ShopService,
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
          this.layer = marker([coords.latitude, coords.longitude], {
            icon: this.geolocationService.getMarkerIcon(),
          })
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
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
    this.allShops.forEach((shop: any, index: number) => {
      const markerLayer = marker([shop.coordinates[0], shop.coordinates[1]], {
        icon: this.geolocationService.getMarkerIcon(),
      })
        .bindPopup(
          `<div class="max-w-sm rounded-md overflow-hidden">
  <img class="w-full" src="https://newsway.com.ng/wp-content/uploads/2023/10/Screenshot_20231015-144313-1024x555.jpg" alt="Shop Image">
  <div class="flex items-center justify-between my-2">
    <div class="font-bold text-md ">${shop.name}</div>
    <img src="assets/shops/star.png" alt="rating"  class="max-w-[50px] w-full"/>
  </div>
  <div class="space-y-1">
    <div class="flex items-center">
      <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="11" />
        <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
      </svg>
      <div class="ml-1">
        23 km 
        <code class="text-sm font-bold text-gray-900">Away </code> from you
      </div>
    </div>
    <div class="flex items-center">
      <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="11" />
        <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
      </svg>
      <div class="ml-1">
        Online
        <code class="text-sm font-bold text-gray-900">Pi orders</code> allowed
      </div>
    </div>
    <div class="flex items-center">
      <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="11" />
        <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
      </svg>
      <div class="ml-1">15 menu available</div>
    </div>
  </div>

<div class="flex items-center justify-center gap-3">

  <div class="bg-red-400 w-[100px]  text-center rounded-md text-white py-1 mt-1" id="${shop._id}">Visit Shop</div>
  <div class="bg-blue-400 w-[100px]  text-center rounded-md text-white py-1 mt-1" id="comming">Take Route</div>
</div>
</div>


`,
        )
        .addTo(this.map)
        .addEventListener('click', (e) => {
          const commingBtn = document.querySelectorAll('#comming');
          commingBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
              this.snackService.showMessage('This feature is in development');
            });
          });

          const buttonElement = document.getElementById(`${shop._id}`);
          if (buttonElement) {
            buttonElement.addEventListener('click', () => this.clicked(shop._id));
          }
        });
    });
  }

  clicked(id: any): void {
    this.navigator.navigate(['manage-business', id]);
  }

  async ngOnInit(): Promise<void> {
    try {
      const response = await axios.get('https://api-mapofpi.vercel.app/shops');

      console.log('From Map of Pi : ', response.data?.data);

      const shops: any[] = response.data?.data;

      this.allShops = shops;
      this.addAllCoordinatesToMap();

      console.log(
        'All shop after fetching them from DB ',
        this.allShops.map((shop) => shop.coordinates),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Map, marker, Layer } from 'leaflet';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import axios from 'axios';
import 'leaflet-routing-machine';
import * as L from 'leaflet';

import { GeolocationService } from '../../core/service/geolocation.service';
import { ShopService } from '../../core/service/shop.service';
import { SnackService } from '../../core/service/snack.service';
import { dummyCoordinates } from '../../core/model/business';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SearchBarComponent, LeafletModule, RouterModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
  layer?: Layer;
  map!: Map;
  options;
  id: string = '65e2d67a38e1e60afd74378d';
  navigator: Router = inject(Router);
  showPopup: boolean = false;
  searchBarQuery: string = '';
  allShops: any[] = [];
  filteredShops: any[] = [];
  userPositions: any[] = [];
  
  // Translation strings
  distanceMessage!: string;
  onlinePiOrdersAllowedMessage!: string;
  menuItemsAvailable!: string;
  visitShop!: string;
  takeRoute!: string;

  coordinates = dummyCoordinates;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly snackService: SnackService,
    private shopService: ShopService,
    private translateService: TranslateService,
  ) {
    this.options = this.geolocationService.getMapOptions();
    this.geolocationService.geolocationTriggerEvent$.subscribe(() => {
      this.locateMe();
    });

    this.userPositions = this.shopService.getUserPosition();

    this.translateService.onLangChange.subscribe(() => {
      // console.log('Language changed. Updating translated strings...');
      this.removeAllMarkersFromMap();
      // Update translated strings here
      this.updateTranslatedStrings();
      // console.log('Translated strings updated:', this.distanceMessage, this.onlinePiOrdersAllowedMessage, this.menuItemsAvailable, this.visitShop, this.takeRoute);
      this.addAllCoordinatesToMap();
    });
  }
  
  async ngOnInit(): Promise<void> {
    try {
      const response = await axios.get('https://api-mapofpi.vercel.app/shops');

      console.log('From Map of Pi : ', response.data?.data);

      const shops: any[] = response.data?.data;

      this.allShops = shops;
      this.filteredShops = shops;

      // Wait for translation update before adding coordinates to the map
      this.updateTranslatedStrings();
      this.addAllCoordinatesToMap();

      console.log(
        'All shops after fetching them from DB ',
        this.allShops.map((shop) => shop.coordinates),
      );
    } catch (error) {
      console.log(error);
    }
    this.track();
  }

  onMapReady(map: Map): void {
    this.map = map;
    // Add all coordinates to the map on component initialization
    this.addAllCoordinatesToMap();
  }

  locateMe(): void {
    this.track();
  }

  // Filter shops based on search query
  filterShops(query: string): void {
    console.log("filterShops called");
    this.filteredShops = this.allShops.filter(shop =>
      shop.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered shops:", this.filteredShops);
    // Update the map markers to reflect the filtered shops
    this.removeAllMarkersFromMap();
    this.addAllCoordinatesToMap(this.filteredShops);
  }

  private updateTranslatedStrings(): void {
    this.distanceMessage = this.translateService.instant('BUSINESS_MARKER_DIALOG.DISTANCE_MESSAGE');
    this.onlinePiOrdersAllowedMessage = this.translateService.instant('BUSINESS_MARKER_DIALOG.DISTANCE_MESSAGE');
    this.menuItemsAvailable = this.translateService.instant('BUSINESS_MARKER_DIALOG.MENU_ITEMS_AVAILABLE_MESSAGE');
    this.visitShop = this.translateService.instant('BUSINESS_MARKER_DIALOG.BUTTONS.VISIT_SHOP');
    this.takeRoute = this.translateService.instant('BUSINESS_MARKER_DIALOG.BUTTONS.TAKE_ROUTE');
  }

  async track() {
    console.log('Coordinates from shop in track: ', this.shopService.getUserPosition());

    const location = await axios.get('https://ipapi.co/json/');

    const { data } = location;

    console.log('User data: ', data);

    const coordinates = [[data.latitude, data.longitude]];

    coordinates.map((coord) => {
      const userMarker = marker([coord[0], coord[1]], {
        icon: this.geolocationService.getUserMarkerIcon(),
      })
        .bindPopup(`<div class=""> You're Here</div>`)
        .openPopup();

      this.map.addLayer(userMarker);
      this.map.flyTo([coord[0], coord[1]], 15);
    });
  }

  addAllCoordinatesToMap(shops?: any[]): void {
    const shopsToAdd = shops ?? this.allShops;

    shopsToAdd.forEach((shop: any, index: number) => {
      const markerLayer = marker([shop.coordinates[0], shop.coordinates[1]], {
        icon: this.geolocationService.getMarkerIcon(),
      }).bindPopup(this.generatePopupContent(shop))
        .addTo(this.map)
        .addEventListener('click', (e) => {
          const commingBtn = document.querySelectorAll('#comming');
          commingBtn.forEach((btn) => {
            btn.addEventListener('click', async () => {
              const location = await axios.get('https://ipapi.co/json/');

              const { data } = location;

              const userLocation = [[data.latitude, data.longitude]];

              const shopLocation = [shop.coordinates[0], shop.coordinates[1]];

              this.map.closePopup();

              const creatingMarkers = (i: number, waypoints: any, n: number) => {
                let icon;

                if (i === 0) {
                  icon = this.geolocationService.getUserMarkerIcon();
                } else if (i === n - 1) {
                  icon = this.geolocationService.getMarkerIcon();
                } else {
                  icon = this.geolocationService.getMiddleIcon();
                }

                const newMarker = L.marker(waypoints.latLng, {
                  icon: icon,
                }).addTo(this.map);

                newMarker.getElement()?.setAttribute('data-custom-type', i === 0 ? 'user' : i === n - 1 ? 'shop' : 'middle');

                newMarker.addEventListener('click', (e) => {
                  const customType = e.target.getElement()?.getAttribute('data-custom-type');

                  switch (customType) {
                    case 'user':
                      this.snackService.showMessage(`Dear Soleil00 You"re located here`);
                      break;
                    case 'shop':
                      newMarker.bindPopup(`
                            <div class="p-4">
                                <div class="text-lg font-bold mb-2">${shop.name}</div>
                                <div>${shop.name} is located here and you are about to take routes towards it. It will approximately take you 23 min by car.</div>
                                <button id="cancelBtn" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Cancel</button>
                            </div>
                        `);

                      // Wait for the popup to open before attaching the event listener
                      newMarker.on('popupopen', () => {
                        const cancelBtn = document.getElementById('cancelBtn');
                        if (cancelBtn) {
                          cancelBtn.addEventListener('click', () => {
                            // routeControl.removeFrom(this.map);
                            this.map.removeControl(routeControl);
                            newMarker.removeFrom(this.map);
                            console.log('Button clicked');
                          });
                        }
                      });

                      break;
                    case 'middle':
                      this.snackService.showMessage('Middle clicked');
                      break;
                    default:
                      this.snackService.showMessage('Unknown marker clicked');
                  }
                });
              };

              const routeControl = (window as any).L.Routing.control({
                waypoints: [(window as any).L.latLng(userLocation[0], userLocation[1]), (window as any).L.latLng(shopLocation[0], shopLocation[1])],
                showAlternatives: true,
                createMarker: creatingMarkers,
                altLineOptions: {
                  styles: [
                    { color: 'black', opacity: 0.15, weight: 9 },
                    { color: 'white', opacity: 0.8, weight: 6 },
                    { color: 'blue', opacity: 0.5, weight: 2 },
                  ],
                },
              });

              console.log('from routing : ', { ...routeControl });
              console.log('type of routes : ', typeof routeControl);
              routeControl.addTo(this.map);
            });
          });

          const buttonElement = document.getElementById(`${shop._id}`);
          if (buttonElement) {
            buttonElement.addEventListener('click', () => this.clicked(shop._id));
          }
        });
    });
  }

  private removeAllMarkersFromMap(): void {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }

  clicked(id: any): void {
    // this.navigator.navigate(['manage-business', id]);
    // this.navigator.navigate(['shop', 'order-menu']);
    this.navigator.navigate(['view-shop', id]);
  }

  private generatePopupContent(shop: any): string {
    return `
      <div class="max-w-sm rounded-md overflow-hidden">
        <img class="w-full" src="${shop.image}" alt="Shop Image">
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
                <code class="text-sm font-bold text-gray-900">23 km</code> ${this.distanceMessage}
              </div>
            </div>
            <div class="flex items-center">
              <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="11" />
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
              </svg>
              <div class="ml-1">
                ${this.onlinePiOrdersAllowedMessage}
              </div>
            </div>
            <div class="flex items-center">
              <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="11" />
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
              </svg>
              <div class="ml-1"><code class="text-sm font-bold text-gray-900">15</code> ${this.menuItemsAvailable}</div>
            </div>
          </div>
        
        <div class="flex items-center justify-center gap-3">
      
        <div class="bg-red-400 w-[100px]  text-center rounded-md text-white py-1 mt-1" id="${shop._id}">${this.visitShop}</div>
        <div class="bg-blue-400 w-[100px]  text-center rounded-md text-white py-1 mt-1" id="comming">${this.takeRoute}</div>
      </div>
    </div>`;
  }
}

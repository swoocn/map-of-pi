import { Component, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeolocationService } from '../../core/service/geolocation.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-action-row',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: './action-row.component.html',
  styleUrl: './action-row.component.scss',
})
export class ActionRowComponent {
  geoLoading: Signal<boolean>;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly router: Router,
  ) {
    this.geoLoading = this.geolocationService.geoLoading;
  }

  locateMe(): void {
    this.geolocationService.triggerGeolocation();
  }

  navigateToBusiness(): void {
    this.router.navigate(['/business']);
  }
}

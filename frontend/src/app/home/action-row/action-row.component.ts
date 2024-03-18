import { Component, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GeolocationService } from '../../core/service/geolocation.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentUserService } from '../../core/service/current-user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SocialComponent } from '../../dialogs/social/social.component';

@Component({
  selector: 'app-action-row',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule, MatDialogModule],
  templateUrl: './action-row.component.html',
  styleUrl: './action-row.component.scss',
})
export class ActionRowComponent implements OnInit {
  geoLoading: Signal<boolean>;
  currentUser: any;

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly router: Router,
    private currentUserService: CurrentUserService,
    public dialog: MatDialog,
  ) {
    this.geoLoading = this.geolocationService.geoLoading;
    this.currentUser = this.currentUserService.getCurrentUser();
  }

  locateMe(): void {
    this.geolocationService.triggerGeolocation();
  }

  navigateToBusiness(): void {
    this.router.navigate(['/business']);
    // console.log('from map user shops', this.currentUser.shops);
  }

  openDialog() {
    const dialogRef = this.dialog.open(SocialComponent, {
      data: {
        name: this.currentUser.username,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed : ' + result);
      if (result === 'true') {
        console.log('User refused');
      } else if (result === 'false') {
        localStorage.setItem('joined', 'true');
      }
    });
  }

  ngOnInit(): void {
    const userJoined = localStorage.getItem('joined');
    if (userJoined === 'true') {
      return;
    } else {
      if (this.currentUserService.getCurrentUser() !== undefined && this.currentUserService.getCurrentUser() !== null) {
        setTimeout(() => {
          // Load current user asynchronously and open dialog once loaded
          this.currentUserService.getCurrentUser().subscribe((user: any) => {
            if (user) {
              this.currentUser = user;
              this.openDialog();
            }
          });
        }, 6000);
      } else {
        console.log('Failed to retrieve user');
      }
    }
  }
}

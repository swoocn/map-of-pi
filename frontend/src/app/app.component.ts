import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { UiStateService } from './core/service/ui-state.service';
import { Pi } from '@pinetwork-js/sdk';
import { AuthResult } from '@pinetwork-js/sdk/build/types';
import { SnackService } from './core/service/snack.service';
import { CurrentUserService } from './core/service/current-user.service';
import axios from 'axios';
import { ShopService } from './core/service/shop.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly snackService: SnackService,
    private readonly uiStateService: UiStateService,
    private readonly currentUserService: CurrentUserService,
    private readonly shopServices: ShopService,
  ) {
    this.uiStateService.setShowBackButton(false);
  }

  ngOnInit() {
    this.shopServices.getAllShops();
    Pi.authenticate(['username', 'wallet_address', 'payments'], (p) => console.log(p))
      .then(async (auth: AuthResult) => {
        try {
          const response = await axios.post('http://localhost:8000/user/signin', {
            authResult: auth,
          });
          const { currentUser, token } = response.data;
          this.currentUserService.setToken(token);
          this.currentUserService.setCurrentUser(currentUser);
          this.snackService.showMessage(`Logging in ${currentUser.username}`);
        } catch (error) {
          console.error(error);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}

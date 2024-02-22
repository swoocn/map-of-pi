import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { UiStateService } from './core/service/ui-state.service';
import { Pi } from '@pinetwork-js/sdk';
import { AuthResult } from '@pinetwork-js/sdk/build/types';
import { SnackService } from './core/service/snack.service';

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
  ) {
    this.uiStateService.setShowBackButton(false);
  }

  ngOnInit() {
    Pi.authenticate(['username'], (p) => console.log(p))
      .then((auth: AuthResult) => this.snackService.showMessage(`Logging in ${auth.user.username}`))
      .catch(function (error) {
        console.error(error);
      });
  }
}

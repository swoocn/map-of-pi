import { ChangeDetectionStrategy, Component, Signal, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DarkModeService } from '../../core/service/dark-mode.service';
import { DarkModeTogglerComponent } from '../dark-mode-toggler/dark-mode-toggler.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { UiStateService } from '../../core/service/ui-state.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, DarkModeTogglerComponent, LanguageSwitcherComponent, TranslateModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HeaderComponent {
  imageUrl: string = 'assets/images/logo.svg';
  hoveredImageUrl: string = 'assets/images/logo-header.svg';
  isHovered: boolean = false;
  showPopup: boolean = false;
  showPrivacyPolicy: boolean = false;

  lastUpdated!: string;
  emailAddress!: string;

  @ViewChild(DarkModeTogglerComponent) darkModeToggler!: DarkModeTogglerComponent;
  showBackButton: Signal<boolean>;

  constructor(
    private readonly location: Location,
    private readonly uiStateService: UiStateService,
    public readonly darkModeService: DarkModeService,
  ) {
    this.showBackButton = this.uiStateService.showBackButton;
    this.lastUpdated = "3/1/2024";
    this.emailAddress = "info@mapofpi.com";
  }

  navigateBack(): void {
    this.location.back();
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  displayPopup(): void {
    this.showPopup = true;
  }

  hidePopup(): void {
    this.showPopup = false;
    this.showPrivacyPolicy = false;
  }

  showPrivacyPolicyPopup() {
    this.showPopup = true;
    this.showPrivacyPolicy = true;
  }

  hidePrivacyPolicyPopup() {
    this.showPrivacyPolicy = false;
  }
}

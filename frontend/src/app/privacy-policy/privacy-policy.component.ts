import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  imports: [TranslateModule]
})

export class PrivacyPolicyComponent {
  lastUpdated!: string;
  emailAddress!: string;

  constructor() { 
    this.lastUpdated = "3/1/2024";
    this.emailAddress = "info@mapofpi.com";
  }
}

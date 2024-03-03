import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})

export class PrivacyPolicyComponent {
  lastUpdated!: string;
  emailAddress!: string;

  constructor() { 
    this.lastUpdated = "3/1/2024";
    this.emailAddress = "info@mapofpi.com";
  }
}

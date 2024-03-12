import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})

export class InformationComponent {
  showPopup: boolean = true;

  version: string = 'Alpha V1.0';
  logo: string = "../../assets/images/logo.svg";

  updateItems: { date: string, updates: string[] }[] = [
    {
      date: '3/12/2024',
      updates: [
        'Temporary removal of Dark Mode feature.',
        'Added Translation for Business Configuration Menu.',
        'Added Translation for Add Products Menu.',
        'Added Business Search functionality.'
      ]
    },
    {
      date: '3/11/2024',
      updates: [
        'Added Translation for Business Marker Dialog.',
        'Added Translation for Shopping Order Menu.',
        'Updated Social Media links.',
        'Fixed horizontal scrolling issue.'
      ]
    },
    {
      date: '3/10/2024',
      updates: [
        'Added Terms of Service section.'
      ]
    },
  ];
  email: string = 'info@mapofpi.com';

  stopPropagation(event: MouseEvent): void {
    // prevent the click event from reaching the parent container.
    event.stopPropagation();
  }
}

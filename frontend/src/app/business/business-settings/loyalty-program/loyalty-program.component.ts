import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loyalty-program',
  standalone: true,
  imports: [],
  templateUrl: './loyalty-program.component.html',
  styleUrl: './loyalty-program.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramComponent {}

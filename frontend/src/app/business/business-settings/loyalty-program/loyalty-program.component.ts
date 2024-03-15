import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loyalty-program',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './loyalty-program.component.html',
  styleUrls: ['./loyalty-program.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyProgramComponent {
  // Create a form group for the loyalty program form
  loyaltyForm = new FormGroup({
    isActive: new FormControl(false), // For toggle switch
    stampsNeeded: new FormControl('', Validators.required), // Input for stamps needed
    freeItemName: new FormControl('', Validators.required), // Input for the name of the free item
    numberOfFreeItems: new FormControl(1, Validators.required) // Input for the number of free items
  });

  constructor() {}

  // Method to call when the form is submitted
  saveSettings() {
    if (this.loyaltyForm.valid) {
      // Handle the form submission
      console.log(this.loyaltyForm.value);
    } else {
      // Handle the case when the form is invalid
      console.log('Form is not valid.');
    }
  }
}
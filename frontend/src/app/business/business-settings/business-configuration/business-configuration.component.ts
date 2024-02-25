import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-configuration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './business-configuration.component.html',
  styleUrl: './business-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BusinessConfigurationComponent implements OnInit {
  @ViewChild('menuToggleDiv') menuToggleDiv!: ElementRef;
  @ViewChild('orderToggleDiv') orderToggleDiv!: ElementRef;
  @ViewChild('paymentToggleDiv') paymentToggleDiv!: ElementRef;
  @ViewChild('addItemButtonSection') addItemButtonSection!: ElementRef;
  @ViewChild('floatingButtonSection') floatingButtonSection!: ElementRef;
  @ViewChild('menuStatusLabel') menuStatusLabel!: ElementRef;
  @ViewChild('orderStatusLabel') orderStatusLabel!: ElementRef;
  @ViewChild('paymentStatusLabel') paymentStatusLabel!: ElementRef;

  businessConfigurationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.businessConfigurationForm = this.formBuilder.group({
      menuEnabled: [true],
      orderEnabled: [false],
      paymentEnabled: [true]
    });

    this.loadToggleStates(); // Load toggle states on initialization
  }

  /**
   * Simulates saving the current states of toggle buttons.
   * Placeholder for backend API call.
   */
  saveToggleStates(): void {
    // Placeholder for saving the current state of toggles to the backend
    console.log('Saving toggle states...');
    // Make API call to the backend
  }

  /**
   * Loads and applies the saved toggle states from the backend.
   */
  loadToggleStates(): void {
    // Placeholder for loading saved toggle states from the backend
    console.log('Loading toggle states...');
    // Simulate fetching data from the backend
    // TODO: Make an API call to your backend to fetch saved states

    // Update the UI based on these states
    this.updateToggleLabels();
    this.updateSliderAppearance();
    this.updateFloatingButtonVisibility();

    // Initialize the toggles based on the menu setting
    this.initializeToggles();
  }

  initializeToggles(): void {
    // Initial state update
    this.updateSliderAppearance();

    const menuEnabled = this.businessConfigurationForm.get('menuEnabled')?.value;

    if (this.orderToggleDiv && this.paymentToggleDiv && this.addItemButtonSection) {
      if (menuEnabled) {
        this.orderToggleDiv.nativeElement.classList.remove('hidden');
        this.paymentToggleDiv.nativeElement.classList.remove('hidden');
        this.addItemButtonSection.nativeElement.classList.remove('hidden');
      } else {
        this.orderToggleDiv.nativeElement.classList.add('hidden');
        this.paymentToggleDiv.nativeElement.classList.add('hidden');
        this.addItemButtonSection.nativeElement.classList.add('hidden');
      }
    }
  }

  /**
    * Updates the visibility of the floating add item button based on the menu toggle state.
    */
  updateFloatingButtonVisibility(): void {
    const menuEnabled = this.businessConfigurationForm.get('menuEnabled')?.value;

    if (this.floatingButtonSection) {
      if (menuEnabled) {
        this.floatingButtonSection.nativeElement.classList.remove('hidden');
      } else {
        this.floatingButtonSection.nativeElement.classList.add('hidden');
      }
    }
  }

  /**
   * Updates the labels next to toggles to reflect their current state off/on.
   */
  updateToggleLabels(): void {
    const menuEnabled = this.businessConfigurationForm.get('menuEnabled')?.value;
    const orderEnabled = this.businessConfigurationForm.get('orderEnabled')?.value;
    const paymentEnabled = this.businessConfigurationForm.get('paymentEnabled')?.value;

    if (this.menuStatusLabel && this.orderStatusLabel && this.paymentStatusLabel) {
      this.menuStatusLabel.nativeElement.textContent = menuEnabled ? 'on' : 'off';
      this.orderStatusLabel.nativeElement.textContent = orderEnabled ? 'on' : 'off';
      this.paymentStatusLabel.nativeElement.textContent = paymentEnabled ? 'on' : 'off';
    }
  }

  /**
   * Updates the appearance of sliders to reflect their state.
   */
  updateSliderAppearance(): void {
    const toggles = document.querySelectorAll('.menu-settings__toggle input');

    toggles.forEach((toggle) => {
      if (toggle instanceof HTMLInputElement) {
        const slider = toggle.nextElementSibling as HTMLElement; // Accurately select the slider span related to each toggle

        if (slider) {
          if (toggle.checked) {
            slider.classList.remove('menu-settings__slider--off');
          } else {
            slider.classList.add('menu-settings__slider--off');
          }
        }
      }
    });
  }

  onToggleChange(toggleId: string): void {
    if (toggleId === 'menu-toggle') {
      this.updateFloatingButtonVisibility();
    }
    this.updateSliderAppearance();
    this.updateToggleLabels();
    this.saveToggleStates();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-business-settings',
  standalone: true,
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.scss'],
  imports: [TranslateModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BusinessSettingsComponent {
  businessTypes: string[] = ['Restaurant', 'Retail', 'Service'];

  businessForm = this.formBuilder.group({
    businessName: ['', Validators.required],
    businessType: ['', Validators.required],
    location: ['', Validators.required]
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  send(): void {
    if (this.businessForm.valid) {
      console.log('# this.businessForm.value: ', this.businessForm.value);
      // Add logic here to send the form data to the backend
    } else {
      console.error('Form is invalid');
      // Optionally, you can display an error message to the user
    }
  }
}

// DEPRECATED
// import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { TranslateModule } from '@ngx-translate/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-business-settings',
//   standalone: true,
//   imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, TranslateModule, RouterLink],
//   templateUrl: './business-settings.component.html',
//   styleUrl: './business-settings.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class BusinessSettingsComponent {
//   businessTypes: string[] = ['restaurant', 'garage', 'music-shop'];
//   businessForm = this.formBuilder.group({
//     name: ['', Validators.required],
//     businessType: ['', Validators.required],
//     address: ['', Validators.required],
//   });

//   constructor(private readonly formBuilder: FormBuilder) {}

//   send(): void {
//     console.log('# this.businessForm.value: ', this.businessForm.value);
//   }
// }

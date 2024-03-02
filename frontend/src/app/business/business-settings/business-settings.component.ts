import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { SnackService } from '../../core/service/snack.service';
import { ShopService } from '../../core/service/shop.service';

@Component({
  selector: 'app-business-settings',
  standalone: true,
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.scss'],
  imports: [TranslateModule, CommonModule, ReactiveFormsModule, MatSlideToggleModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BusinessSettingsComponent {
  businessTypes: string[] = ['Restaurant', 'Retail Store', 'Servicing', 'Construction', 'Transportation'];
  router: Router = inject(Router);
  showPopup: boolean = false;

  registerShopForm = new FormGroup({
    shopName: new FormControl('', Validators.required),
    shopType: new FormControl('', Validators.required),
    shopAddress: new FormControl('', Validators.required),
    shopPhone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    shopEmail: new FormControl('', [Validators.required, Validators.email]),
    // shopImage: new FormControl(''),
    shopDescription: new FormControl('', Validators.required),
  });

  constructor(
    private snackService: SnackService,
    private shopServices: ShopService,
  ) {}

  // onFileChange(event: any) {
  //   if (event.target.files) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);

  //     reader.onload = (event: any) => {
  //       this.registerShopForm.value.shopImage = event.target.result;
  //     };
  //   }
  // }

  send(): void {
    if (this.registerShopForm.valid) {
      this.shopServices.registerShop(this.registerShopForm.value as any).then((response) => {
        // console.log('reponse from server : ' + JSON.stringify(response));
        if (response.success) {
          this.snackService.showMessage('Business successfully registered');
          this.router.navigate(['manage-business', response.data._id]);
          this.snackService.showMessage(`Redirecting to ${response.data.name} shop`);
        } else {
          this.snackService.showError('Failed to register business');
          console.log(response);
        }
      });
    } else {
      this.registerShopForm.markAllAsTouched();
      console.log('Invalid data');
    }
  }

  displayPopup(): void {
    this.showPopup = true;
  }

  hidePopup(): void {
    this.showPopup = false;
  }
}

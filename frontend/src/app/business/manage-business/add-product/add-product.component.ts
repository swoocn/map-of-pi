import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm = new FormGroup({
    productName: new FormControl(''),
    productPrice: new FormControl(''),
    productDescription: new FormControl(''),
    productImages: new FormControl(''),
    productStock: new FormControl(''),
    selectedShippingOption: new FormControl(''),
  });

  selectedImages: any[] = [];

  onFileChange(event: any) {
    if (event.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
    }
  }

  submitForm() {
    // const imageUrl = this.selectedImages[0].url;
    // const cleanedUrl = imageUrl.replace('data:', '');
    console.log(this.selectedImages);
  }
}

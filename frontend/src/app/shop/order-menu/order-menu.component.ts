import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-menu.component.html',
  styleUrl: './order-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderMenuComponent implements OnInit {

  ngOnInit(): void {
    this.products.forEach(product => {
      product.showAddButton = true;
      product.showDeleteButton = false;
    });
  }

  // Placeholder values; TODO: replace with real data from datastore integration.
  cartItemCount: number = 0;
  businessName: string = 'Business Name'; 
  businessType: string = 'Coffee Shop'; 
  businessAddress: string = '123 Main Street, Anytown, AN 12345, Country';
  stampsButtonText: string = '4 Stamps';
  highlightText: string = 'You can order online and pay in person';

  businessImages: any[] = [
    { url: "../../../assets/images/shopping/mock/coffee-shop-image.jpg", alt: "Interior of coffee shop with a barista at work" },
    { url: "../../../assets/images/shopping/mock/coffee-shop-image_2.jpg", alt: "Close-up of a coffee cup on a table" },
    { url: "../../../assets/images/shopping/mock/coffee-shop-image_3.jpg", alt: "Exterior view of the coffee shop" }
  ];

  products: any[] = [
    // Placeholder product data
    { id: 'coffee1', name: 'Coffee 1', amount: 'XX', imageUrl: '../../../assets/images/shopping/mock/coffee-1.jpg', imageAlt: 'Image of a cappuccino', description: 'Description Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora eius harum quisquam?.', quantity: 1 },
    { id: 'coffee2', name: 'Coffee 2', amount: 'XX', imageUrl: '../../../assets/images/shopping/mock/coffee-2.webp', imageAlt: 'Image of a cappuccino', description: 'Description Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum exercitationem beatae dignissimos!', quantity: 1 }
  ];

  decreaseQuantity(product: any): void {
    // Handle decreasing quantity for a product
    product.quantity = Math.max(0, product.quantity - 1); // Ensure quantity does not go below 0
  }

  increaseQuantity(product: any): void {
    // Handle increasing quantity for a product
    product.quantity++;
  }

  addToCart(product: any): void {
    this.updateCartCount(product.quantity);
    product.showAddButton = false;
    product.showDeleteButton = true;
  }

  removeFromCart(product: any): void {
    this.updateCartCount(-product.quantity);
    product.quantity = 1;
    product.showAddButton = true;
    product.showDeleteButton = false;
  }

  /**
  * Updates the shopping cart count.
  * @param {number} amount - The amount to adjust the cart count by.
  */
  updateCartCount(amount: number): void {
    this.cartItemCount += amount;
    this.cartItemCount = Math.max(this.cartItemCount, 0); // Ensure count does not go below 0
  }

  openShoppingCart() {
    // Placeholder method
  }

  switchToStampsMenu() {
    // Placeholder method
  }

  switchToProductsMenu() {
  }
}

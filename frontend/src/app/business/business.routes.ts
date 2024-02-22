import { Routes } from '@angular/router';
import { BusinessComponent } from './business.component';

export const BUSINESS_ROUTES: Routes = [
  {
    path: '',
    component: BusinessComponent,
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'loyalty-scan',
    loadComponent: () => import('./loyalty-scan/loyalty-scan.component').then((m) => m.LoyaltyScanComponent),
  },
  {
    path: 'business-photos',
    loadComponent: () => import('./business-settings/business-photos/business-photos.component').then((m) => m.BusinessPhotosComponent),
  },
  {
    path: 'loyalty-program',
    loadComponent: () => import('./business-settings/loyalty-program/loyalty-program.component').then((m) => m.LoyaltyProgramComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./business-settings/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'qr-code',
    loadComponent: () => import('./business-settings/qr-code/qr-code.component').then((m) => m.QrCodeComponent),
  },
];

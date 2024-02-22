import { Routes } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ShopComponent } from './shop.component';
import { SHOP_ROUTES } from './shop.routes';

describe('Shop Routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
  });

  it('should have the default route pointing to ShopComponent', () => {
    const routes: Routes = SHOP_ROUTES;
    const defaultRoute = routes.find((route) => route.path === '');

    expect(defaultRoute).toBeDefined();
    if (defaultRoute) {
      expect(defaultRoute.component).toBe(ShopComponent);
    }
  });

  it('should contain the expected routes', () => {
    const routes: Routes = SHOP_ROUTES;
    const routePaths = routes.map((r) => r.path);
    expect(routePaths).toContain('product-list');
    expect(routePaths).toContain('loyalty-info');
    expect(routePaths).toContain('shop-info');
    expect(routePaths).toContain('shopping-cart');
    expect(routePaths).toContain('order-progress');
    expect(routePaths).toContain('order-details');
    expect(routePaths).toContain('transactions');
    expect(routePaths).toContain('order-complete');
  });
});

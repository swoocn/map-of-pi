import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ShopService } from '../../core/service/shop.service';
import { CurrentUserService } from '../../core/service/current-user.service';
import { PaymentsService } from '../../core/service/payments.service';

@Component({
  selector: 'app-manage-business',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './manage-business.component.html',
  styleUrl: './manage-business.component.scss',
})
export class ManageBusinessComponent implements OnInit {
  currentuser: any;
  shopId: string = '';
  shop: any;
  params: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  constructor(
    private shopServices: ShopService,
    private currentUserService: CurrentUserService,
    private paymentService: PaymentsService,
  ) {
    this.shopId = this.params.snapshot.params['id'];
    // this.currentuser = this.currentUserService.getCurrentUser();
  }

  goToBusiness() {
    this.router.navigate(['add-product']);
  }

  order() {
    this.paymentService.orderProductFromShop('Iphone12', 23, {
      productId: 'user-ordered-product',
      shopId: this.shopId,
      shop: this.shop,
    });
  }

  ngOnInit(): void {
    this.shopServices
      .getShop(this.shopId)
      .then((response) => {
        // console.log('from response in manage busines : ', response);
        this.shop = response.data;
        this.currentuser = this.currentUserService.getCurrentUser();
        console.log(' here is the real shop : ', this.shop);
      })
      .catch((err) => {
        console.log(' error while setting shop : ', err);
      });
  }
}

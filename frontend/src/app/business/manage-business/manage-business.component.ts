import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-business',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './manage-business.component.html',
  styleUrl: './manage-business.component.scss',
})
export class ManageBusinessComponent {
  router: Router = inject(Router);
  constructor() {}

  goToBusiness() {
    this.router.navigate(['add-product']);
  }
}

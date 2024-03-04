import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductComponent, TranslateModule.forRoot()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

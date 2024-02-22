import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderProgressComponent } from './order-progress.component';

describe('OrderProgressComponent', () => {
  let component: OrderProgressComponent;
  let fixture: ComponentFixture<OrderProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProgressComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(OrderProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch order details', () => {
    spyOn(component, 'fetchOrderDetails');
    component.ngOnInit();
    expect(component.fetchOrderDetails).toHaveBeenCalled();
  });

  it('should initialize timer', () => {
    spyOn(component, 'initializeTimer');
    component.ngOnInit();
    expect(component.initializeTimer).toHaveBeenCalled();
  });

  it('should fetch total price', () => {
    spyOn(component, 'fetchTotalPrice');
    component.ngOnInit();
    expect(component.fetchTotalPrice).toHaveBeenCalled();
  });
});

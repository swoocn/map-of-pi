import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessConfigurationComponent } from './business-configuration.component';

describe('BusinessConfigurationComponent', () => {
  let component: BusinessConfigurationComponent;
  let fixture: ComponentFixture<BusinessConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BusinessConfigurationComponent } from './business-configuration.component';

describe('BusinessConfigurationComponent', () => {
  let component: BusinessConfigurationComponent;
  let fixture: ComponentFixture<BusinessConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.businessConfigurationForm.setValue({
      menuEnabled: true,
      orderEnabled: false,
      paymentEnabled: true
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.businessConfigurationForm).toBeDefined();
    expect(component.businessConfigurationForm.get('menuEnabled')?.value).toBe(true);
    expect(component.businessConfigurationForm.get('orderEnabled')?.value).toBe(false);
    expect(component.businessConfigurationForm.get('paymentEnabled')?.value).toBe(true);
  });

  it('should load toggle states and update form', () => {
    spyOn(component, 'initializeToggles');
    spyOn(component, 'updateToggleLabels');
    spyOn(component, 'updateSliderAppearance');
    spyOn(component, 'updateFloatingButtonVisibility');

    component.loadToggleStates();

    expect(component.initializeToggles).toHaveBeenCalled();
    expect(component.updateToggleLabels).toHaveBeenCalled();
    expect(component.updateSliderAppearance).toHaveBeenCalled();
    expect(component.updateFloatingButtonVisibility).toHaveBeenCalled();
  });

  it('should update toggle labels correctly', () => {
    component.businessConfigurationForm.patchValue({
      orderEnabled: true,
      paymentEnabled: false
    });

    component.updateToggleLabels();

    expect(component.menuStatusLabel.nativeElement.textContent).toEqual('on');
    expect(component.orderStatusLabel.nativeElement.textContent).toEqual('on');
    expect(component.paymentStatusLabel.nativeElement.textContent).toEqual('off');
  });

  it('should hide appropriate sections when menuEnabled is false', () => {
    component.businessConfigurationForm.patchValue({
      menuEnabled: false
    });

    component.loadToggleStates();

    expect(component.orderToggleDiv.nativeElement.classList.contains('hidden')).toBeTruthy();
    expect(component.paymentToggleDiv.nativeElement.classList.contains('hidden')).toBeTruthy();
    expect(component.floatingButtonSection.nativeElement.classList.contains('hidden')).toBeTruthy();
  });

  it('should call saveToggleStates on toggle change', () => {
    spyOn(component, 'saveToggleStates');
    component.onToggleChange('menu-toggle');
    expect(component.saveToggleStates).toHaveBeenCalled();
  });
});

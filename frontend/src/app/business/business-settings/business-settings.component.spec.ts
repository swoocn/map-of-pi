import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BusinessSettingsComponent } from './business-settings.component';

describe('BusinessSettingsComponent', () => {
  let component: BusinessSettingsComponent;
  let fixture: ComponentFixture<BusinessSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSettingsComponent, ReactiveFormsModule, TranslateModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form on initialization', () => {
     // Form should be invalid initially.
    expect(component.businessForm.valid).toBeFalse();
  });

  it('should display error message when form is submitted with invalid data', () => {
    spyOn(console, 'error');
    component.send();
    expect(console.error).toHaveBeenCalledWith('Form is invalid');
  });

  it('should have correct routerLink set for the business registration confirm button', () => {
    const button = fixture.nativeElement.querySelector('.business-registration__button');
    // Angular attribute added during runtime to reflect the value of the `[routerLink]` directive.
    expect(button.getAttribute('ng-reflect-router-link')).toEqual('/business/products');
  }); 
});

// DEPRECATED
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { BusinessSettingsComponent } from './business-settings.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { ActivatedRoute } from '@angular/router';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// describe('BusinessSettingsComponent', () => {
//   let component: BusinessSettingsComponent;
//   let fixture: ComponentFixture<BusinessSettingsComponent>;

//   beforeEach(async () => {

//     const activatedRouteStub = {
//       snapshot: {
//         paramMap: new Map<string, string>()
//       }
//     };

//     await TestBed.configureTestingModule({
//       imports: [BusinessSettingsComponent, NoopAnimationsModule, TranslateModule.forRoot()],
//       providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }]
//     }).compileComponents();

//     fixture = TestBed.createComponent(BusinessSettingsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

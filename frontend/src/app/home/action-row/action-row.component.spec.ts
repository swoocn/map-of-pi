import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRowComponent } from './action-row.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ActionRowComponent', () => {
  let component: ActionRowComponent;
  let fixture: ComponentFixture<ActionRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionRowComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

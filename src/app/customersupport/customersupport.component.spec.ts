import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersupportComponent } from './customersupport.component';

describe('CustomersupportComponent', () => {
  let component: CustomersupportComponent;
  let fixture: ComponentFixture<CustomersupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

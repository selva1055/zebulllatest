import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPlacedConformationDialogBoxComponent } from './order-placed-conformation-dialog-box.component';

describe('OrderPlacedConformationDialogBoxComponent', () => {
  let component: OrderPlacedConformationDialogBoxComponent;
  let fixture: ComponentFixture<OrderPlacedConformationDialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPlacedConformationDialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlacedConformationDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

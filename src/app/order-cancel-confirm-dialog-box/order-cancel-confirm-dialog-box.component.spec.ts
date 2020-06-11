import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelConfirmDialogBoxComponent } from './order-cancel-confirm-dialog-box.component';

describe('OrderCancelConfirmDialogBoxComponent', () => {
  let component: OrderCancelConfirmDialogBoxComponent;
  let fixture: ComponentFixture<OrderCancelConfirmDialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCancelConfirmDialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCancelConfirmDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

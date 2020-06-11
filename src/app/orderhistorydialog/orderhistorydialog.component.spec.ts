import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderhistorydialogComponent } from './orderhistorydialog.component';

describe('OrderhistorydialogComponent', () => {
  let component: OrderhistorydialogComponent;
  let fixture: ComponentFixture<OrderhistorydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderhistorydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderhistorydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

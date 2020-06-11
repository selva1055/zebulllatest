import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebuOrderBookComponent } from './zebu-order-book.component';

describe('ZebuOrderBookComponent', () => {
  let component: ZebuOrderBookComponent;
  let fixture: ComponentFixture<ZebuOrderBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZebuOrderBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZebuOrderBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

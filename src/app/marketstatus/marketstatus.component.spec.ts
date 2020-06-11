import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketstatusComponent } from './marketstatus.component';

describe('MarketstatusComponent', () => {
  let component: MarketstatusComponent;
  let fixture: ComponentFixture<MarketstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketwatchlistComponent } from './marketwatchlist.component';

describe('MarketwatchlistComponent', () => {
  let component: MarketwatchlistComponent;
  let fixture: ComponentFixture<MarketwatchlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketwatchlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketwatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

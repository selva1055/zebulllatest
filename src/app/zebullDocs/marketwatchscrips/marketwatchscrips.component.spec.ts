import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketwatchscripsComponent } from './marketwatchscrips.component';

describe('MarketwatchscripsComponent', () => {
  let component: MarketwatchscripsComponent;
  let fixture: ComponentFixture<MarketwatchscripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketwatchscripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketwatchscripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

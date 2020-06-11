import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetlimitsComponent } from './getlimits.component';

describe('GetlimitsComponent', () => {
  let component: GetlimitsComponent;
  let fixture: ComponentFixture<GetlimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetlimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetlimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

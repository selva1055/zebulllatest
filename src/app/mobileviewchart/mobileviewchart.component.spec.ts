import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileviewchartComponent } from './mobileviewchart.component';

describe('MobileviewchartComponent', () => {
  let component: MobileviewchartComponent;
  let fixture: ComponentFixture<MobileviewchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileviewchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileviewchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

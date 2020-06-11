import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionconvertionComponent } from './positionconvertion.component';

describe('PositionconvertionComponent', () => {
  let component: PositionconvertionComponent;
  let fixture: ComponentFixture<PositionconvertionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionconvertionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionconvertionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionbookComponent } from './positionbook.component';

describe('PositionbookComponent', () => {
  let component: PositionbookComponent;
  let fixture: ComponentFixture<PositionbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

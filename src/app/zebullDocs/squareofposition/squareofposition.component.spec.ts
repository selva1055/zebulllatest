import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareofpositionComponent } from './squareofposition.component';

describe('SquareofpositionComponent', () => {
  let component: SquareofpositionComponent;
  let fixture: ComponentFixture<SquareofpositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareofpositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareofpositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

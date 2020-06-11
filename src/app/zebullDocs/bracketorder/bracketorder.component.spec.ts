import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketorderComponent } from './bracketorder.component';

describe('BracketorderComponent', () => {
  let component: BracketorderComponent;
  let fixture: ComponentFixture<BracketorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BracketorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BracketorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

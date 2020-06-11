import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitbracketorderComponent } from './exitbracketorder.component';

describe('ExitbracketorderComponent', () => {
  let component: ExitbracketorderComponent;
  let fixture: ComponentFixture<ExitbracketorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitbracketorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitbracketorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

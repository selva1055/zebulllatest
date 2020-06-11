import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionIdComponent } from './session-id.component';

describe('SessionIdComponent', () => {
  let component: SessionIdComponent;
  let fixture: ComponentFixture<SessionIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

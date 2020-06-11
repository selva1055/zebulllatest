import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Validate2faComponent } from './validate2fa.component';

describe('Validate2faComponent', () => {
  let component: Validate2faComponent;
  let fixture: ComponentFixture<Validate2faComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Validate2faComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Validate2faComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Save2faComponent } from './save2fa.component';

describe('Save2faComponent', () => {
  let component: Save2faComponent;
  let fixture: ComponentFixture<Save2faComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Save2faComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Save2faComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

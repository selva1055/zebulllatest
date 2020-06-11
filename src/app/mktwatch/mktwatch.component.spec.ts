import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktwatchComponent } from './mktwatch.component';

describe('MktwatchComponent', () => {
  let component: MktwatchComponent;
  let fixture: ComponentFixture<MktwatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktwatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddscripsComponent } from './addscrips.component';

describe('AddscripsComponent', () => {
  let component: AddscripsComponent;
  let fixture: ComponentFixture<AddscripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddscripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddscripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

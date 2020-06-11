import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScripsdetailsComponent } from './scripsdetails.component';

describe('ScripsdetailsComponent', () => {
  let component: ScripsdetailsComponent;
  let fixture: ComponentFixture<ScripsdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScripsdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScripsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

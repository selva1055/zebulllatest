import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingbookComponent } from './holdingbook.component';

describe('HoldingbookComponent', () => {
  let component: HoldingbookComponent;
  let fixture: ComponentFixture<HoldingbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldingbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

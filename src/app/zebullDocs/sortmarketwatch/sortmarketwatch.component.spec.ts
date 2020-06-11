import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortmarketwatchComponent } from './sortmarketwatch.component';

describe('SortmarketwatchComponent', () => {
  let component: SortmarketwatchComponent;
  let fixture: ComponentFixture<SortmarketwatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortmarketwatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortmarketwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

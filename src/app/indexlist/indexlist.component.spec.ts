import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexlistComponent } from './indexlist.component';

describe('IndexlistComponent', () => {
  let component: IndexlistComponent;
  let fixture: ComponentFixture<IndexlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

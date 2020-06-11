import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradebookComponent } from './tradebook.component';

describe('TradebookComponent', () => {
  let component: TradebookComponent;
  let fixture: ComponentFixture<TradebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

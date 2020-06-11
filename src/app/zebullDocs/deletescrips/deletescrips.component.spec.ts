import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletescripsComponent } from './deletescrips.component';

describe('DeletescripsComponent', () => {
  let component: DeletescripsComponent;
  let fixture: ComponentFixture<DeletescripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletescripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletescripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionDialogComponent } from './conversion-dialog.component';

describe('ConversionDialogComponent', () => {
  let component: ConversionDialogComponent;
  let fixture: ComponentFixture<ConversionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

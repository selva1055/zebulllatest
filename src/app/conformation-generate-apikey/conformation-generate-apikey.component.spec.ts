import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformationGenerateApikeyComponent } from './conformation-generate-apikey.component';

describe('ConformationGenerateApikeyComponent', () => {
  let component: ConformationGenerateApikeyComponent;
  let fixture: ComponentFixture<ConformationGenerateApikeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformationGenerateApikeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformationGenerateApikeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

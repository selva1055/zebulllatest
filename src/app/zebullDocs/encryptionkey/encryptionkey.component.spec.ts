import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionkeyComponent } from './encryptionkey.component';

describe('EncryptionkeyComponent', () => {
  let component: EncryptionkeyComponent;
  let fixture: ComponentFixture<EncryptionkeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncryptionkeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

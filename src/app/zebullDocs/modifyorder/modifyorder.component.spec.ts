import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyorderComponent } from './modifyorder.component';

describe('ModifyorderComponent', () => {
  let component: ModifyorderComponent;
  let fixture: ComponentFixture<ModifyorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

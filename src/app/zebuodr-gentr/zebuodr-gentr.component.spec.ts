import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebuodrGentrComponent } from './zebuodr-gentr.component';

describe('ZebuodrGentrComponent', () => {
  let component: ZebuodrGentrComponent;
  let fixture: ComponentFixture<ZebuodrGentrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZebuodrGentrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZebuodrGentrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebuFauthenComponent } from './zebu-fauthen.component';

describe('ZebuFauthenComponent', () => {
  let component: ZebuFauthenComponent;
  let fixture: ComponentFixture<ZebuFauthenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZebuFauthenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZebuFauthenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebulldocComponent } from './zebulldoc.component';

describe('ZebulldocComponent', () => {
  let component: ZebulldocComponent;
  let fixture: ComponentFixture<ZebulldocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZebulldocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZebulldocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

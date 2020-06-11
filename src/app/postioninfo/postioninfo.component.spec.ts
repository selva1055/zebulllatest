import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostioninfoComponent } from './postioninfo.component';

describe('PostioninfoComponent', () => {
  let component: PostioninfoComponent;
  let fixture: ComponentFixture<PostioninfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostioninfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostioninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

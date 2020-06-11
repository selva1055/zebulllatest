import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostmanComponent } from './postman.component';

describe('PostmanComponent', () => {
  let component: PostmanComponent;
  let fixture: ComponentFixture<PostmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

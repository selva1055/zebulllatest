import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqchartComponent } from './iqchart.component';
import { Components } from '../chartiq/js/components';
import { ComponentUI } from '../chartiq/js/componentUI';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('IqchartComponent', () => {
  let component: IqchartComponent;
  let fixture: ComponentFixture<IqchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqchartComponent, Components, ComponentUI ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

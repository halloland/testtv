import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdDatepickerRangeComponent } from './ngbd-datepicker-range.component';

describe('NgbdDatepickerRangeComponent', () => {
  let component: NgbdDatepickerRangeComponent;
  let fixture: ComponentFixture<NgbdDatepickerRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdDatepickerRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdDatepickerRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

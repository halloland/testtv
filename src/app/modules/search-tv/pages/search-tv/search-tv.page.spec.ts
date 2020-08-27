import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTvPage } from './search-tv.page';

describe('SearchTvComponent', () => {
  let component: SearchTvPage;
  let fixture: ComponentFixture<SearchTvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTvPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

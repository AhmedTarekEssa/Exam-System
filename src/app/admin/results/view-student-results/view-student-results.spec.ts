import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentResults } from './view-student-results';

describe('ViewStudentResults', () => {
  let component: ViewStudentResults;
  let fixture: ComponentFixture<ViewStudentResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudentResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudentResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

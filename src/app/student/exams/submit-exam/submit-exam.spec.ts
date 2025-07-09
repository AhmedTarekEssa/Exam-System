import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitExam } from './submit-exam';

describe('SubmitExam', () => {
  let component: SubmitExam;
  let fixture: ComponentFixture<SubmitExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

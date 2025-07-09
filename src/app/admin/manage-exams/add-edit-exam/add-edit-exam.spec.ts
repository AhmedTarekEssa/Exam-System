import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExam } from './add-edit-exam';

describe('AddEditExam', () => {
  let component: AddEditExam;
  let fixture: ComponentFixture<AddEditExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

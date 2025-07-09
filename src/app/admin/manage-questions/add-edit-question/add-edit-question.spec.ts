import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditQuestion } from './add-edit-question';

describe('AddEditQuestion', () => {
  let component: AddEditQuestion;
  let fixture: ComponentFixture<AddEditQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

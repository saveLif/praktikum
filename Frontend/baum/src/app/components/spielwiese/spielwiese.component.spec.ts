import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpielwieseComponent } from './spielwiese.component';

describe('SpielwieseComponent', () => {
  let component: SpielwieseComponent;
  let fixture: ComponentFixture<SpielwieseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpielwieseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpielwieseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

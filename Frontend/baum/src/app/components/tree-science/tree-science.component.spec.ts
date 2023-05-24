import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeScienceComponent } from './tree-science.component';

describe('TreeScienceComponent', () => {
  let component: TreeScienceComponent;
  let fixture: ComponentFixture<TreeScienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeScienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeScienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

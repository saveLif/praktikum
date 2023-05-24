import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenGameComponent } from './green-game.component';

describe('GreenGameComponent', () => {
  let component: GreenGameComponent;
  let fixture: ComponentFixture<GreenGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

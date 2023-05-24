import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservierungComponent } from './reservierung.component';

describe('ReservierungComponent', () => {
  let component: ReservierungComponent;
  let fixture: ComponentFixture<ReservierungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservierungComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservierungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeltranglisteComponent } from './weltrangliste.component';

describe('WeltranglisteComponent', () => {
  let component: WeltranglisteComponent;
  let fixture: ComponentFixture<WeltranglisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeltranglisteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeltranglisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

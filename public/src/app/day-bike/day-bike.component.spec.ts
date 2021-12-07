import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DayBikeComponent } from './day-bike.component';

describe('DayBikeComponent', () => {
  let component: DayBikeComponent;
  let fixture: ComponentFixture<DayBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayBikeComponent ], imports:[FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDeTrabalhoComponent } from './area-de-trabalho.component';

describe('AreaDeTrabalhoComponent', () => {
  let component: AreaDeTrabalhoComponent;
  let fixture: ComponentFixture<AreaDeTrabalhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaDeTrabalhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaDeTrabalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

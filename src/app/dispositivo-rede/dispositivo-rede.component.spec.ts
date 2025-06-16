import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivoRedeComponent } from './dispositivo-rede.component';

describe('DispositivoRedeComponent', () => {
  let component: DispositivoRedeComponent;
  let fixture: ComponentFixture<DispositivoRedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivoRedeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispositivoRedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

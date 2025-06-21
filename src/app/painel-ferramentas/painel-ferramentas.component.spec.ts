import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelFerramentasComponent } from './painel-ferramentas.component';

describe('PainelFerramentasComponent', () => {
  let component: PainelFerramentasComponent;
  let fixture: ComponentFixture<PainelFerramentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFerramentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelFerramentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

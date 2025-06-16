import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  // BehaviorSubject que guarda o valor atual do zoom (escala)
  private scaleSubject = new BehaviorSubject<number>(1);

  // Observable público para componentes assinarem
  scale$ = this.scaleSubject.asObservable();

  constructor() { }

  // Atualiza a escala e notifica assinantes
  setScale(newScale: number) {
    // Opcional: limite para escala mínima e máxima
    if (newScale < 0.1) newScale = 0.1;
    else if (newScale > 5) newScale = 5;

    this.scaleSubject.next(newScale);
  }

  // Recupera o valor atual da escala (síncrono)
  getScale(): number {
    return this.scaleSubject.getValue();
  }
}

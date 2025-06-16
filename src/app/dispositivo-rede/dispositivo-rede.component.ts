import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { DispositivoRede } from '../dispositivos/dispositivo-rede';
import { CommonModule } from '@angular/common';
import { ZoomService } from '../area-de-trabalho/zoom.service';  // import do serviço

@Component({
  selector: 'app-dispositivo-rede',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dispositivo-rede.component.html',
  styleUrls: ['./dispositivo-rede.component.css']
})
export class DispositivoRedeComponent {
  @Input() dispositivo!: DispositivoRede;
  @Output() posicaoMudou = new EventEmitter<{ x: number; y: number }>();

  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private el: ElementRef, private zoomService: ZoomService) {}

  moverPara(x: number, y: number) {
    this.dispositivo.moverPara(x, y);
  }

  inicializarDispositivo() {
    this.dispositivo.inicializar();
  }

  desligarDispositivo() {
    this.dispositivo.desligar();
  }

  @HostListener('mousedown', ['$event'])
  onDragStart(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;

    const workspace = document.querySelector('.workspace-area') as HTMLElement;
    if (!workspace) return;

    const rect = workspace.getBoundingClientRect();

    // Pega a escala atual do serviço (síncrono)
    const scale = this.zoomService.getScale();

    // Pega translate X e Y da workspace do estilo computado (continuar usando o DOM aqui)
    const transform = window.getComputedStyle(workspace).transform;
    let offsetXWorkspace = 0, offsetYWorkspace = 0;

    if (transform && transform !== 'none') {
      const match = transform.match(/matrix\(([^)]+)\)/);
      if (match) {
        const values = match[1].split(',').map(Number);
        offsetXWorkspace = values[4];
        offsetYWorkspace = values[5];
      }
    }

    this.offsetX = (event.clientX - rect.left - offsetXWorkspace) / scale - this.dispositivo.x;
    this.offsetY = (event.clientY - rect.top - offsetYWorkspace) / scale - this.dispositivo.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    event.stopPropagation();

    const workspace = document.querySelector('.workspace-area') as HTMLElement;
    if (!workspace) return;

    const rect = workspace.getBoundingClientRect();

    // Pega escala atual do serviço
    const scale = this.zoomService.getScale();

    // Pega translate X e Y da workspace do estilo computado
    const transform = window.getComputedStyle(workspace).transform;
    let offsetXWorkspace = 0, offsetYWorkspace = 0;

    if (transform && transform !== 'none') {
      const match = transform.match(/matrix\(([^)]+)\)/);
      if (match) {
        const values = match[1].split(',').map(Number);
        offsetXWorkspace = values[4];
        offsetYWorkspace = values[5];
      }
    }

    const newX = (event.clientX - rect.left - this.offsetX - offsetXWorkspace) / scale;
    const newY = (event.clientY - rect.top - this.offsetY - offsetYWorkspace) / scale;

    this.dispositivo.x = newX;
    this.dispositivo.y = newY;
    this.posicaoMudou.emit({ x: newX, y: newY });
  }

  @HostListener('document:mouseup', ['$event'])
  onDragEnd(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isDragging = false;
  }
}

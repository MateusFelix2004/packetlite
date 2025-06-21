import { Component } from '@angular/core';
import { Computador } from '../dispositivos/computador/computador';
import { Roteador } from '../dispositivos/roteador/roteador';
import { Switch } from '../dispositivos/switch/switch';
import { DispositivoRede } from '../dispositivos/dispositivo-rede';
import { CommonModule } from '@angular/common';
import { DispositivoRedeComponent } from '../dispositivo-rede/dispositivo-rede.component';
import { PainelFerramentasComponent } from '../painel-ferramentas/painel-ferramentas.component';

/**
 * Componente que gerencia a área de trabalho (workspace) com funcionalidades de zoom e arraste.
 */
@Component({
  selector: 'app-area-de-trabalho',
  standalone: true,
  imports: [DispositivoRedeComponent, PainelFerramentasComponent,CommonModule],
  templateUrl: './area-de-trabalho.component.html',
  styleUrls: ['./area-de-trabalho.component.css']
})
export class AreaDeTrabalhoComponent {

  // Indica se um dispositivo está sendo arrastado na workspace
  isDraggingDevice = false;

  // Elementos/dispositivos na workspace
  elements: DispositivoRede[] = [];

  // Estado e variáveis para movimentação e zoom da workspace
  isDragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  scale: number = 1;

  // Variáveis para manipulação de zoom por pinça (touch)
  initialPinchDistance: number | null = null;
  initialScale: number = 1;

  /**
   * Manipula o evento de zoom utilizando o scroll do mouse.
   * @param event Evento de rolagem do mouse.
   */
  onZoom(event: WheelEvent): void {
    const zoomFactor = event.deltaY < 0 ? 1.05 : 0.95;
    this.scale *= zoomFactor;

    if (this.scale < 0.1) this.scale = 0.1;
    else if (this.scale > 5) this.scale = 5;

    this.updateTransform();
  }

  /**
   * Inicia o processo de arraste da workspace (drag) para mouse ou touch.
   * @param event Evento de início do arraste.
   */
  onDragStart(event: MouseEvent | TouchEvent): void {
    if (event instanceof TouchEvent) {
      if (event.touches.length === 2) {
        this.initialPinchDistance = this.getDistance(event.touches[0], event.touches[1]);
        this.initialScale = this.scale;
      } else if (event.touches.length === 1) {
        this.isDragging = true;
        const point = this.getTouchPoint(event.touches[0]);
        this.dragStartX = point.x;
        this.dragStartY = point.y;
      }
    } else {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    }
  }

  /**
   * Método chamado quando o dispositivo começa a ser arrastado (drag).
   */
  onDispositivoDragStart() {
    this.isDraggingDevice = true;
  }

  /**
   * Método chamado quando o dispositivo termina o arraste (drop).
   */
  onDispositivoDragEnd() {
    this.isDraggingDevice = false;
  }

  /**
   * Atualiza a posição durante o arraste da workspace.
   * Bloqueia movimentação se estiver arrastando dispositivo.
   * @param event Evento de movimentação (mouse ou touch).
   */
  onDragMove(event: MouseEvent | TouchEvent): void {
    if (this.isDraggingDevice) return; // bloqueia pan enquanto arrasta dispositivo

    if (event instanceof TouchEvent) {
      if (event.touches.length === 2 && this.initialPinchDistance !== null) {
        const newDistance = this.getDistance(event.touches[0], event.touches[1]);
        const zoomFactor = newDistance / this.initialPinchDistance;
        this.scale = this.initialScale * zoomFactor;
        this.updateTransform();
      } else if (event.touches.length === 1 && this.isDragging) {
        const point = this.getTouchPoint(event.touches[0]);
        const dx = point.x - this.dragStartX;
        const dy = point.y - this.dragStartY;

        this.offsetX += dx;
        this.offsetY += dy;

        this.dragStartX = point.x;
        this.dragStartY = point.y;

        this.updateTransform();
      }
    } else {
      if (!this.isDragging) return;

      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;

      this.offsetX += dx;
      this.offsetY += dy;

      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;

      this.updateTransform();
    }
  }

  /**
   * Finaliza o processo de arraste.
   */
  onDragEnd(): void {
    this.isDragging = false;
    this.initialPinchDistance = null;
  }

  /**
   * Atualiza a transformação de escala e posição da workspace.
   */
  updateTransform(): void {
    const area = document.querySelector('.workspace-area') as HTMLElement;
    if (area) {
      area.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
    }
  }

  /**
   * Calcula a distância entre dois toques (para zoom por pinça).
   * @param touch1 Primeiro ponto de toque.
   * @param touch2 Segundo ponto de toque.
   * @returns Distância entre os toques.
   */
  getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Obtém a posição do toque na tela.
   * @param touch Toque atual.
   * @returns Objeto com x e y.
   */
  getTouchPoint(touch: Touch): { x: number; y: number } {
    return { x: touch.clientX, y: touch.clientY };
  }

  // Controle do tipo de dispositivo sendo arrastado da sidebar
  draggingType: string | null = null;

  /**
   * Referências para as imagens dos elementos para drag image.
   */
  elementImages: { [key: string]: HTMLImageElement } = {
    'computador': new Image(),
    'roteador': new Image(),
    'switch': new Image(),
  };

  constructor() {
    this.elementImages['computador'].onload = () => {};
    this.elementImages['computador'].src = 'assets/dispositivos/icones/computador/computador.svg';

    this.elementImages['roteador'].onload = () => {};
    this.elementImages['roteador'].src = 'assets/dispositivos/icones/roteador/roteador.svg';

    this.elementImages['switch'].onload = () => {};
    this.elementImages['switch'].src = 'assets/dispositivos/icones/switch/switch.svg';
  }

  /**
   * Iniciado ao arrastar um item da sidebar.
   */
  onSidebarDragStart(event: DragEvent, type: string): void {
    this.draggingType = type;

    const image = this.elementImages[type];

    if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
      const offsetX = image.naturalWidth / 2;
      const offsetY = image.naturalHeight / 2;
      event.dataTransfer?.setDragImage(image, offsetX, offsetY);
    } else {
      const img = new Image();
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
      event.dataTransfer?.setDragImage(img, 0, 0);
      console.warn(`Imagem não carregada ou não definida para o tipo: ${type}`);
    }

    event.dataTransfer?.setData('text/plain', type);
  }

  /**
   * Permite o drop sobre a workspace.
   */
  onWorkspaceDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /**
   * Solta o elemento na posição do cursor.
   */
  onWorkspaceDrop(event: DragEvent): void {
    event.preventDefault();

    const type = this.draggingType;
    if (!type) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;

    const width = 60;
    const height = 60;

    // Ajusta a posição considerando offset e escala
    const dropX = (clientX - rect.left - width / 2 - this.offsetX) / this.scale;
    const dropY = (clientY - rect.top - height / 2 - this.offsetY) / this.scale;

    let novoDispositivo: DispositivoRede | null = null;

    if (type === 'computador') {
      novoDispositivo = new Computador(
        `pc-${Date.now()}`,
        'Computador',
        '192.168.0.10',       // IP padrão
        'AA:BB:CC:DD:EE:01',  // MAC fictício
        dropX,
        dropY
      );
    } else if (type === 'roteador') {
      novoDispositivo = new Roteador(
        `rt-${Date.now()}`,
        'Roteador',
        'MinhaRede',         // SSID padrão
        dropX,
        dropY
      );
    } else if (type === 'switch') {
      novoDispositivo = new Switch(
        `sw-${Date.now()}`,
        'Switch',
        8,                   // número padrão de portas
        dropX,
        dropY
      );
    }

    if (novoDispositivo) {
      this.elements.push(novoDispositivo);
      console.log(this.elements);
    }

    this.draggingType = null;
  }

  /**
   * Atualiza a posição de um dispositivo na workspace.
   * @param element Dispositivo a ser atualizado.
   * @param posicao Nova posição x,y.
   */
  atualizarPosicao(element: DispositivoRede, posicao: { x: number; y: number }) {
    element.x = posicao.x;
    element.y = posicao.y;
    // Pode salvar estado ou fazer outras atualizações aqui
  }

  /**
 * Remove um dispositivo da área de trabalho.
 * @param dispositivo - O dispositivo a ser removido.
 */
removerDispositivo(dispositivo: DispositivoRede) {
  const index = this.elements.indexOf(dispositivo);
  if (index > -1) {
    this.elements.splice(index, 1);
  }
}
}

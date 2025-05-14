import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente que gerencia a área de trabalho (workspace) com funcionalidades de zoom e arraste.
 */
@Component({
  selector: 'app-area-de-trabalho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area-de-trabalho.component.html',
  styleUrl: './area-de-trabalho.component.css'
})
export class AreaDeTrabalhoComponent {

  // Estado do sidebar (aberto ou fechado)
  sidebarOpen: boolean = true;

  /**
   * Alterna a visibilidade de uma seção dentro da área de trabalho.
   * @param event - Evento de clique no cabeçalho da seção.
   */
  toggleSection(event: Event) {
    const header = event.currentTarget as HTMLElement;
    const content = header.nextElementSibling as HTMLElement;
    const icon = header.querySelector('[data="icon"]');
  
    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
  
    // Alteração do estado de abertura da seção
    if (isOpen) {
      content.style.maxHeight = '0px';
      if (icon) icon.textContent = 'chevron_right';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (icon) icon.textContent = 'expand_more';
    }
  }

  /**
   * Alterna o estado de abertura do sidebar.
   */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Elementos interativos na workspace (exemplo: formas)
  elements = [
    { id: 'element1', type: 'circle', x: 200, y: 200, width: 100, height: 100, color: '#FF5733' },
    { id: 'element2', type: 'square', x: 400, y: 200, width: 60, height: 60, color: 'pink' },
    { id: 'element3', type: 'triangle', x: 600, y: 200, width: 60, height: 60, color: 'green' },
  ];

  // Estado e variáveis para movimentação e zoom
  isDragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  scale: number = 1;

  // Variáveis para manipulação de zoom por pinça
  initialPinchDistance: number | null = null;
  initialScale: number = 1;

  /**
   * Manipula o evento de zoom utilizando o scroll do mouse.
   * @param event - Evento de rolagem do mouse.
   */
  onZoom(event: WheelEvent): void {
    // Determina o fator de zoom (mais suave)
    const zoomFactor = event.deltaY < 0 ? 1.05 : 0.95; // Ajuste esse valor para controlar a velocidade
    this.scale *= zoomFactor;

    // Limita o valor de scale para evitar zoom excessivo
    if (this.scale < 0.1) {
      this.scale = 0.1;
    } else if (this.scale > 5) {
      this.scale = 5;
    }

    // Atualiza a transformação (posição e escala) da área de trabalho
    this.updateTransform();
  }

  /**
   * Inicia o processo de arraste (drag) de um elemento, tanto para mouse quanto para touch.
   * @param event - Evento de início de arraste (mouse ou toque).
   */
  onDragStart(event: MouseEvent | TouchEvent): void {
    if (event instanceof TouchEvent) {
      if (event.touches.length === 2) {
        // Zoom por pinça
        this.initialPinchDistance = this.getDistance(event.touches[0], event.touches[1]);
        this.initialScale = this.scale;
      } else if (event.touches.length === 1) {
        // Arraste com um único toque
        this.isDragging = true;
        const point = this.getTouchPoint(event.touches[0]);
        this.dragStartX = point.x;
        this.dragStartY = point.y;
      }
    } else {
      // Arraste com o mouse
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    }
  }

  /**
   * Atualiza a posição do arraste enquanto o usuário está movendo o mouse ou toque.
   * @param event - Evento de movimentação (mouse ou toque).
   */
  onDragMove(event: MouseEvent | TouchEvent): void {
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
   * Atualiza a transformação de escala e posição da área de trabalho.
   */
  updateTransform(): void {
    const area = document.querySelector('.workspace-area') as HTMLElement;
    if (area) {
      area.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
    }
  }

  /**
   * Calcula a distância entre dois pontos de toque (utilizado para zoom por pinça).
   * @param touch1 - Primeiro ponto de toque.
   * @param touch2 - Segundo ponto de toque.
   * @returns A distância entre os dois toques.
   */
  getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Obtém a posição do toque em relação à página.
   * @param touch - O toque atual.
   * @returns A posição do toque.
   */
  getTouchPoint(touch: Touch): { x: number; y: number } {
    return { x: touch.clientX, y: touch.clientY };
  }

// SIDE BAR DRAG AND DROP

draggingType: string | null = null;

/**
 * Referências para as imagens dos elementos
 */
elementImages: { [key: string]: HTMLImageElement } = {
  'computador': new Image(),
  'roteador': new Image(),
  'switch': new Image(),
  // Adicione outras imagens conforme necessário
};

constructor() {
  // Define os src das imagens e espera que elas carreguem para obter suas dimensões
  this.elementImages['computador'].onload = () => {};
  this.elementImages['computador'].src = 'assets/dispositivos/icones/computador/computador.svg';

  this.elementImages['roteador'].onload = () => {};
  this.elementImages['roteador'].src = 'assets/dispositivos/icones/roteador/roteador.svg';

  this.elementImages['switch'].onload = () => {};
  this.elementImages['switch'].src = 'assets/dispositivos/icones/switch/switch.svg';
}

/**
 * Iniciado ao arrastar um item da sidebar
 */
onSidebarDragStart(event: DragEvent, type: string): void {
  this.draggingType = type;

  const image = this.elementImages[type];

  if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
    const offsetX = image.naturalWidth / 2;
    const offsetY = image.naturalHeight / 2;
    event.dataTransfer?.setDragImage(image, offsetX, offsetY);
  } else {
    // Se a imagem não estiver carregada ou não existir, usa o fantasma transparente padrão
    const img = new Image();
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    event.dataTransfer?.setDragImage(img, 0, 0);
    console.warn(`Imagem não carregada ou não definida para o tipo: ${type}`);
  }

  event.dataTransfer?.setData('text/plain', type);
}

/**
 * Permite o drop sobre a workspace
 */
onWorkspaceDragOver(event: DragEvent): void {
  event.preventDefault();
}

/**
 * Solta o elemento na posição do cursor
 */
onWorkspaceDrop(event: DragEvent): void {
  event.preventDefault();

  const type = this.draggingType;
  if (!type) return;

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const clientX = event.clientX;
  const clientY = event.clientY;

  let width = 50;
  let height = 50;
  let color = 'gray';
  let shape: 'square' | 'circle' = 'square';

  if (type === 'computador') {
    width = height = 60;
    color = '#007BFF';
    shape = 'square';
  } else if (type === 'roteador') {
    width = height = 80;
    color = 'purple';
    shape = 'circle';
  } else if (type === 'switch') {
    width = height = 80;
    color = 'red';
    shape = 'circle';
  }

  // Corrige a posição para centralizar o elemento no cursor
  const dropX = (clientX - rect.left - width / 2 - this.offsetX) / this.scale;
  const dropY = (clientY - rect.top - height / 2 - this.offsetY) / this.scale;

  const newElement = {
    id: 'el-' + Date.now(),
    type: shape,
    x: dropX,
    y: dropY,
    width,
    height,
    color
  };

  this.elements.push(newElement);
  this.draggingType = null;
}
}

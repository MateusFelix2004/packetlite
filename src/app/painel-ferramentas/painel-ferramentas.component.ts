import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-painel-ferramentas',
  standalone: true,
  imports: [],
  templateUrl: './painel-ferramentas.component.html',
  styleUrl: './painel-ferramentas.component.css'
})
export class PainelFerramentasComponent {
  @Output() arrastarDispositivo = new EventEmitter<{ event: DragEvent, tipo: string }>();
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  sidebarOpen: boolean = true;

  /**
   * Alterna uma seção colapsável (abre ou fecha).
   */
  toggleSection(event: Event): void {
    const header = event.currentTarget as HTMLElement;
    const content = header.nextElementSibling as HTMLElement;
    const icon = header.querySelector('[data="icon"]');

    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

    if (isOpen) {
      content.style.maxHeight = '0px';
      if (icon) icon.textContent = 'chevron_right';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (icon) icon.textContent = 'expand_more';
    }
  }

  /**
   * Alterna o estado de visibilidade da sidebar.
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.toggleSidebarEvent.emit();
  }

  /**
   * Dispara evento ao iniciar o arraste de um item da sidebar.
   */
  onSidebarDragStart(event: DragEvent, tipo: string): void {
    this.arrastarDispositivo.emit({ event, tipo });
  }
}

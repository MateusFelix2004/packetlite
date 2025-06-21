import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { DispositivoRede } from '../dispositivos/dispositivo-rede';
import { CommonModule } from '@angular/common';
import { ZoomService } from '../area-de-trabalho/zoom.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dispositivo-rede',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispositivo-rede.component.html',
  styleUrls: ['./dispositivo-rede.component.css']
})
export class DispositivoRedeComponent implements OnInit {
  @Input() dispositivo!: DispositivoRede;
  @Output() posicaoMudou = new EventEmitter<{ x: number; y: number }>();
  @Output() excluir = new EventEmitter<void>();

  @ViewChild('inputNome') inputNome!: ElementRef<HTMLInputElement>;

  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  x: number = 0;
  y: number = 0;

  editandoNome: boolean = false;
  contextMenuVisivel: boolean = false;
  posicaoMenu = { x: 0, y: 0 };

  constructor(private el: ElementRef, private zoomService: ZoomService) {}

  ngOnInit() {
    this.x = this.dispositivo.x;
    this.y = this.dispositivo.y;
  }

  moverPara(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.posicaoMudou.emit({ x, y });
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
    const scale = this.zoomService.getScale();
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

    this.offsetX = (event.clientX - rect.left - offsetXWorkspace) / scale - this.x;
    this.offsetY = (event.clientY - rect.top - offsetYWorkspace) / scale - this.y;
  }

  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    event.stopPropagation();

    const workspace = document.querySelector('.workspace-area') as HTMLElement;
    if (!workspace) return;

    const rect = workspace.getBoundingClientRect();
    const scale = this.zoomService.getScale();
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

    this.x = (event.clientX - rect.left - this.offsetX - offsetXWorkspace) / scale;
    this.y = (event.clientY - rect.top - this.offsetY - offsetYWorkspace) / scale;

    this.posicaoMudou.emit({ x: this.x, y: this.y });

    this.dispositivo.x = this.x;
    this.dispositivo.y = this.y;
  }

  @HostListener('document:mouseup', ['$event'])
  onDragEnd(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isDragging = false;
  }

  @HostListener('document:click')
  fecharContextMenu() {
    this.contextMenuVisivel = false;
  }

  ativarEdicao() {
    this.editandoNome = true;

    // Foca o input após renderização
    setTimeout(() => {
      this.inputNome?.nativeElement.focus();
    });
  }

  desativarEdicao() {
    this.editandoNome = false;
  }

  abrirContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuVisivel = true;
    this.posicaoMenu = { x: event.clientX, y: event.clientY };
  }

  mostrarPropriedades() {
    console.log('Propriedades do dispositivo:', this.dispositivo);
    this.contextMenuVisivel = false;
  }

  excluirDispositivo() {
    this.excluir.emit();
    this.contextMenuVisivel = false;
  }
}

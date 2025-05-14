import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  menuAberto = false;
  anoAtual = new Date().getFullYear();

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  registrar() {
    // Redireciona para a tela de registro
    console.log('Redirecionando para registro...');
  }

  entrar() {
    // Redireciona para a tela de login
    console.log('Redirecionando para login...');
  }

  verDemo() {
    // Pode abrir modal ou redirecionar para vídeo
    console.log('Abrindo demonstração...');
  }
  
}

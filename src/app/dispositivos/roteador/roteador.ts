import { DispositivoRede } from '../dispositivo-rede';

/**
 * Classe que representa um roteador na rede.
 * 
 * Especializa DispositivoRede com propriedades típicas de um roteador,
 * como SSID, DHCP, roteamento etc.
 */
export class Roteador extends DispositivoRede {
  ssid?: string;

  constructor(
    id: string,
    nome: string,
    ip: string,
    mac: string,
    ssid?: string,
    x: number = 0,
    y: number = 0
  ) {
    super(
      id,
      nome,
      'roteador',
      'inativo',
      ip,
      mac,
      [],   // interfaces
      [],   // conexoes
      x,
      y,
      140,  // largura (um pouco maior para roteador)
      100,  // altura
      'assets/dispositivos/icones/roteador/roteador.svg' // ícone padrão roteador
    );
    this.ssid = ssid;
  }

  inicializar(): void {
    console.log(`[${this.nome}] Inicializando roteador com SSID "${this.ssid || 'indefinido'}"...`);
    this.alterarEstado('ativo');
  }

  desligar(): void {
    console.log(`[${this.nome}] Desligando roteador...`);
    this.alterarEstado('inativo');
  }

  /**
   * Exemplo de método específico: alterar o SSID do roteador.
   */
  configurarSSID(novoSSID: string): void {
    this.ssid = novoSSID;
    console.log(`[${this.nome}] SSID configurado para "${this.ssid}".`);
  }
}

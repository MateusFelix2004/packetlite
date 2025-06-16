import { DispositivoRede } from '../dispositivo-rede';

/**
 * Classe que representa um computador na rede.
 * 
 * Esta classe especializa a classe abstrata DispositivoRede,
 * podendo implementar comportamentos específicos de um computador,
 * como inicialização do sistema, desligamento e configuração de IP.
 */
export class Computador extends DispositivoRede {
  /**
   * Cria uma nova instância de Computador.
   * 
   * @param id Identificador único do computador.
   * @param nome Nome descritivo do computador.
   * @param ip Endereço IP.
   * @param mac Endereço MAC.
   */
  constructor(
    id: string,
    nome: string,
    ip?: string,
    mac?: string,
    x: number = 0,
    y: number = 0
  ) {
    super(
      id,
      nome,
      'computador',
      'inativo',
      ip,
      mac,
      [], // interfaces
      [], // conexões
      x,  // x
      y,  // y
      100, // largura
      100, // altura
      'assets/dispositivos/icones/computador/computador.svg' // ícone padrão
    );
  }

  /**
   * Inicializa o computador.
   * Pode simular o boot de um sistema operacional.
   */
  inicializar(): void {
    console.log(`[${this.nome}] Inicializando sistema operacional...`);
  }

  /**
   * Desliga o computador.
   */
  desligar(): void {
    console.log(`[${this.nome}] Desligando...`);
  }

  /**
   * Define um novo endereço IP para o computador.
   * 
   * @param novoIP Novo IP a ser atribuído.
   */
  configurarIP(novoIP: string): void {
    this.ip = novoIP;
  }
}

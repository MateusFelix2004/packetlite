import { DispositivoRede } from '../dispositivo-rede';
import { InterfaceRede } from '../interface-rede'; // ajuste o caminho conforme seu projeto

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
   * @param ip Endereço IP inicial da interface principal (opcional).
   * @param mac Endereço MAC inicial da interface principal (opcional).
   * @param x Posição horizontal no plano.
   * @param y Posição vertical no plano.
   */
  constructor(
    id: string,
    nome: string,
    ip?: string,
    mac?: string,
    x: number = 0,
    y: number = 0
  ) {
    // Cria a interface padrão (ex: "eth0") para o computador
    const interfacePrincipal = new InterfaceRede('iface-1', 'eth0', 'livre', ip, mac);

    super(
      id,
      nome,
      'computador',
      'inativo',
      [interfacePrincipal], // interfaces agora com a interface principal criada
      [],                   // conexões
      x,
      y,
      100,
      100,
      'assets/dispositivos/icones/computador/computador.svg'
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
   * Define um novo endereço IP para a interface principal do computador.
   * Caso haja mais de uma interface, esta função altera a primeira.
   * 
   * @param novoIP Novo IP a ser atribuído.
   */
  configurarIP(novoIP: string): void {
    if (this.interfaces.length > 0) {
      this.interfaces[0].alterarIp(novoIP);
    } else {
      console.warn(`[${this.nome}] Nenhuma interface disponível para configurar IP.`);
    }
  }
}

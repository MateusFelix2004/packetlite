import { InterfaceRede } from './interface-rede';

/**
 * Classe abstrata que representa um dispositivo de rede genérico.
 *
 * Essa classe serve como base para tipos específicos de dispositivos,
 * como computadores, switches, roteadores etc.
 * 
 * Ela também encapsula propriedades visuais (posição, tamanho, ícone) que podem ser usadas
 * na renderização do componente correspondente na interface gráfica.
 */
export abstract class DispositivoRede {
  /**
   * @param id Identificador único do dispositivo.
   * @param nome Nome descritivo do dispositivo.
   * @param tipo Tipo do dispositivo (ex: 'computador', 'switch', 'roteador').
   * @param estado Estado atual do dispositivo: 'ativo' ou 'inativo'.
   * @param interfaces Lista de objetos InterfaceRede que representam as interfaces físicas ou lógicas do dispositivo.
   * @param conexoes Lista de outros dispositivos conectados a este.
   * @param x Posição horizontal (em pixels) do dispositivo no plano.
   * @param y Posição vertical (em pixels) do dispositivo no plano.
   * @param width Largura visual do dispositivo (em pixels).
   * @param height Altura visual do dispositivo (em pixels).
   * @param icon Caminho para o ícone/imagem que representa visualmente o dispositivo.
   */
  constructor(
    public id: string,
    public nome: string,
    public tipo: string,
    public estado: 'ativo' | 'inativo' = 'inativo',
    public interfaces: InterfaceRede[] = [],
    public conexoes: DispositivoRede[] = [],
    public x: number = 0,
    public y: number = 0,
    public width: number = 100,
    public height: number = 100,
    public icon: string = ''
  ) {}

  /**
   * Método abstrato que deve ser implementado pelas subclasses.
   * Define o comportamento ao ligar ou configurar o dispositivo.
   */
  abstract inicializar(): void;

  /**
   * Método abstrato que deve ser implementado pelas subclasses.
   * Define o comportamento ao desligar o dispositivo.
   */
  abstract desligar(): void;

  /**
   * Adiciona uma conexão com outro dispositivo.
   * Representa uma ligação entre este dispositivo e outro na topologia da rede.
   * 
   * @param dispositivo Dispositivo a ser conectado.
   */
  adicionarConexao(dispositivo: DispositivoRede): void {
    this.conexoes.push(dispositivo);
  }

  /**
   * Remove uma conexão com outro dispositivo.
   * Usado para simular a desconexão de cabos ou perda de vínculo lógico.
   * 
   * @param dispositivo Dispositivo a ser desconectado.
   */
  removerConexao(dispositivo: DispositivoRede): void {
    this.conexoes = this.conexoes.filter(d => d.id !== dispositivo.id);
  }

  /**
   * Altera o estado do dispositivo.
   * Pode ser usado para simular o acionamento de um botão liga/desliga, por exemplo.
   * 
   * @param novoEstado Novo estado: 'ativo' ou 'inativo'.
   */
  alterarEstado(novoEstado: 'ativo' | 'inativo'): void {
    this.estado = novoEstado;
  }

  /**
   * Move o dispositivo para uma nova posição no plano.
   * 
   * @param x Nova posição horizontal em pixels.
   * @param y Nova posição vertical em pixels.
   */
  moverPara(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Altera o IP de uma interface específica identificada pelo seu ID.
   * 
   * @param interfaceId ID da interface que terá o IP alterado.
   * @param novoIp Novo endereço IP a ser atribuído.
   * @returns true se a interface foi encontrada e alterada; false caso contrário.
   */
  alterarIpInterface(interfaceId: string, novoIp: string): boolean {
    const iface = this.interfaces.find(i => i.id === interfaceId);
    if (iface) {
      iface.alterarIp(novoIp);
      return true;
    }
    return false;
  }

  /**
   * Altera a máscara de rede de uma interface específica identificada pelo seu ID.
   * 
   * @param interfaceId ID da interface que terá a máscara alterada.
   * @param novaMascara Nova máscara de rede a ser atribuída.
   * @returns true se a interface foi encontrada e alterada; false caso contrário.
   */
  alterarMascaraInterface(interfaceId: string, novaMascara: string): boolean {
    const iface = this.interfaces.find(i => i.id === interfaceId);
    if (iface) {
      iface.alterarMascara(novaMascara);
      return true;
    }
    return false;
  }
}

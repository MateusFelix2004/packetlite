import { DispositivoRede } from '../dispositivo-rede';
import { InterfaceRede } from '../interface-rede'; // ajuste o caminho conforme necessário

/**
 * Classe que representa um switch na rede.
 * 
 * Especializa DispositivoRede com propriedades e comportamentos típicos de um switch,
 * como número de portas e gerenciamento básico.
 */
export class Switch extends DispositivoRede {
  numPortas: number;

  constructor(
    id: string,
    nome: string,
    numPortas: number = 8,
    x: number = 0,
    y: number = 0
  ) {
    // Criar as interfaces do switch, nomeando como porta1, porta2, etc.
    const interfaces: InterfaceRede[] = [];
    for (let i = 1; i <= numPortas; i++) {
      interfaces.push(new InterfaceRede(`iface-${i}`, `porta${i}`, 'livre'));
    }

    super(
      id,
      nome,
      'switch',
      'inativo',
      interfaces,   // interfaces com as portas
      [],          // conexoes
      x,
      y,
      120,         // largura (um pouco maior que computador)
      80,          // altura
      'assets/dispositivos/icones/switch/switch.svg' // ícone padrão para switch
    );
    this.numPortas = numPortas;
  }

  inicializar(): void {
    console.log(`[${this.nome}] Inicializando switch com ${this.numPortas} portas...`);
    this.alterarEstado('ativo');
  }

  desligar(): void {
    console.log(`[${this.nome}] Desligando switch...`);
    this.alterarEstado('inativo');
  }

  /**
   * Exemplo de método específico: conecta um dispositivo a uma porta do switch.
   * Esta implementação simplificada apenas adiciona a conexão.
   * 
   * @param dispositivo Dispositivo a ser conectado.
   */
  conectarDispositivo(dispositivo: DispositivoRede): void {
    this.adicionarConexao(dispositivo);
    console.log(`[${this.nome}] Dispositivo ${dispositivo.nome} conectado.`);
  }
}

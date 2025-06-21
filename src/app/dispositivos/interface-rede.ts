export class InterfaceRede {
  constructor(
    public id: string,                         // ID interno único
    public nome: string = '',                  // Nome visível (ex: eth0)
    public estado: 'livre' | 'ocupada' = 'livre',
    public ip?: string,
    public mascara?: string,                   // Ex: '255.255.255.0' ou '/24'
    public mac?: string
  ) {}

  ocupar() {
    this.estado = 'ocupada';
  }

  liberar() {
    this.estado = 'livre';
  }

  estaOcupada(): boolean {
    return this.estado === 'ocupada';
  }

  alterarIp(novoIp: string) {
    this.ip = novoIp;
  }

  alterarMascara(novaMascara: string) {
    this.mascara = novaMascara;
  }

}

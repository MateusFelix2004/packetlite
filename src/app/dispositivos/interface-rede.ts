export class InterfaceRede {
    constructor(
      public id: string,
      public nome: string,          // Ex: "eth0", "porta1"
      public estado: 'livre' | 'ocupada' = 'livre',
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
  }
  
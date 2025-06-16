import { InterfaceRede } from "./interface-rede";

export class Conexao {
    constructor(
      public id: string,
      public interfaceA: InterfaceRede,
      public interfaceB: InterfaceRede,
      public tipo: 'cabo' | 'fibra' | 'semFio' = 'cabo'
    ) {}
  }
  
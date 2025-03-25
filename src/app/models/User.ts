export interface User {
    id: number;
    name: string;
    email: string;
    password: string; // Aunque se envíe encriptada, en la interfaz se puede poner como 'string'
  }
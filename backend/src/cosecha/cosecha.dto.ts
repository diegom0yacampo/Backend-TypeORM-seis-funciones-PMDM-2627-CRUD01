export interface CrearCosechaDto {
  nombre: string;
  kilos: number;
  granjaId: number;
}

export interface ModificarCosechaDto {
  nombre?: string;
  kilos?: number;
}

export interface CambiarGranjaDto {
  granjaId: number;
}

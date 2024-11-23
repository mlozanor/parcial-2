/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class DiagnosticoDto {
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly tratamiento: string;

  @IsNotEmpty()
  readonly pacienteId: string; // Relación con el paciente
}

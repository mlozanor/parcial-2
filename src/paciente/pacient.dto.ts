/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PacienteDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly genero: string;

  @IsOptional() // Diagnósticos pueden ser opcionales al crear o actualizar un paciente
  readonly diagnosticos?: string[];

  @IsOptional() // Médicos pueden ser opcionales al crear o actualizar un paciente
  readonly medico?: string[];
}

/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsPhoneNumber , IsOptional} from 'class-validator';

export class MedicoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly especialidad: string;

  @IsPhoneNumber(null) // Valida números de teléfono
  @IsNotEmpty()
  readonly telefono: string;

  @IsOptional() // Pacientes pueden ser opcionales al crear o actualizar un médico
  readonly pacientes?: string[];
}

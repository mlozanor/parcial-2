import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';

@Entity()
export class DiagnosticoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ length: 200 })
  descripcion: string;

  @ManyToOne(() => PacienteEntity, (paciente) => paciente.diagnosticos)
  paciente: PacienteEntity;
}

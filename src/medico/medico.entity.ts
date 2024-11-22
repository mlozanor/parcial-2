import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';

@Entity()
export class MedicoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  @ManyToOne(() => PacienteEntity, (paciente) => paciente.medico)
  pacientes: PacienteEntity[];
}

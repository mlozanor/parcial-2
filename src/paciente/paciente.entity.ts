import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

@Entity()
export class PacienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  genero: string;

  @OneToMany(() => MedicoEntity, (medico) => medico.pacientes)
    medico: MedicoEntity[];

  @OneToMany(() => DiagnosticoEntity, (diagnostico) => diagnostico.paciente)
  diagnosticos: DiagnosticoEntity[];
    paciente: any[];
}

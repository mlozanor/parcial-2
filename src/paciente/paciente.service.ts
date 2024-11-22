/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['diagnosticos'] });
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id }, relations: ['diagnosticos'] });
    if (!paciente) {
      throw new BusinessLogicException('The paciente with the given id was not found', BusinessError.NOT_FOUND);
    }
    return paciente;
  }

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3) {
      throw new BusinessLogicException('Paciente nombre must have at least 3 characters', BusinessError.PRECONDITION_FAILED);
    }
    return await this.pacienteRepository.save(paciente);
  }

  async update(id: string, paciente: PacienteEntity): Promise<PacienteEntity> {
    const persistedPaciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id } });
    if (!persistedPaciente) {
      throw new BusinessLogicException('The paciente with the given id was not found', BusinessError.NOT_FOUND);
    }
    return await this.pacienteRepository.save({ ...persistedPaciente, ...paciente });
  }

  async delete(id: string): Promise<void> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id }, relations: ['diagnosticos'] });
    if (!paciente) {
      throw new BusinessLogicException('The paciente with the given id was not found', BusinessError.NOT_FOUND);
    }
    if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
      throw new BusinessLogicException('Cannot delete paciente with associated diagnosticos', BusinessError.PRECONDITION_FAILED);
    }
    await this.pacienteRepository.remove(paciente);
  }
}

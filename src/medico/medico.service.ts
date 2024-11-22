/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find();
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id } });
    if (!medico) {
      throw new BusinessLogicException('The medico with the given id was not found', BusinessError.NOT_FOUND);
    }
    return medico;
  }

  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (!medico.nombre || !medico.especialidad) {
      throw new BusinessLogicException('Nombre and Especialidad cannot be empty', BusinessError.PRECONDITION_FAILED);
    }
    return await this.medicoRepository.save(medico);
  }

  async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
    const persistedMedico: MedicoEntity = await this.medicoRepository.findOne({ where: { id } });
    if (!persistedMedico) {
      throw new BusinessLogicException('The medico with the given id was not found', BusinessError.NOT_FOUND);
    }
    return await this.medicoRepository.save({ ...persistedMedico, ...medico });
  }

  async delete(id: string): Promise<void> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id }, relations: ['pacientes'] });
    if (!medico) {
      throw new BusinessLogicException('The medico with the given id was not found', BusinessError.NOT_FOUND);
    }
    if (medico.pacientes && medico.pacientes.length > 0) {
      throw new BusinessLogicException('Cannot delete medico with associated patients', BusinessError.PRECONDITION_FAILED);
    }
    await this.medicoRepository.remove(medico);
  }
}

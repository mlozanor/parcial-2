/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find({ relations: ['paciente'] });
  }

  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id }, relations: ['paciente'] });
    if (!diagnostico) {
      throw new BusinessLogicException('The diagnostico with the given id was not found', BusinessError.NOT_FOUND);
    }
    return diagnostico;
  }

  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    if (diagnostico.descripcion.length > 200) {
      throw new BusinessLogicException('Descripcion must be at most 200 characters', BusinessError.PRECONDITION_FAILED);
    }
    return await this.diagnosticoRepository.save(diagnostico);
  }

  async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    const persistedDiagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!persistedDiagnostico) {
      throw new BusinessLogicException('The diagnostico with the given id was not found', BusinessError.NOT_FOUND);
    }
    return await this.diagnosticoRepository.save({ ...persistedDiagnostico, ...diagnostico });
  }

  async delete(id: string): Promise<void> {
    const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new BusinessLogicException('The diagnostico with the given id was not found', BusinessError.NOT_FOUND);
    }
    await this.diagnosticoRepository.remove(diagnostico);
  }
}

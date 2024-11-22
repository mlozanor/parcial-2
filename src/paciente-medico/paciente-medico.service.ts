/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
    }

    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medico'] });
    if (!paciente) {
      throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
    }

    if (paciente.medico && paciente.medico.length >= 5) {
      throw new BusinessLogicException("A paciente cannot have more than 5 medicos assigned", BusinessError.PRECONDITION_FAILED);
    }

    paciente.medico = [...paciente.medico, medico];
    return await this.pacienteRepository.save(paciente);
  }

  async findMedicoByPacienteIdAndMedicoId(pacienteId: string, medicoId: string): Promise<MedicoEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medico'] });
    if (!paciente) {
      throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
    }

    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
    }

    const pacienteMedico: MedicoEntity = paciente.medico.find((m) => m.id === medicoId);
    if (!pacienteMedico) {
      throw new BusinessLogicException("The medico with the given id is not associated to the paciente", BusinessError.PRECONDITION_FAILED);
    }

    return pacienteMedico;
  }

  async findMedicosByPacienteId(pacienteId: string): Promise<MedicoEntity[]> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medico'] });
    if (!paciente) {
      throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
    }

    return paciente.medico;
  }

  async removeMedicoFromPaciente(pacienteId: string, medicoId: string): Promise<void> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medico'] });
    if (!paciente) {
      throw new BusinessLogicException("The paciente with the given id was not found", BusinessError.NOT_FOUND);
    }

    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id: medicoId } });
    if (!medico) {
      throw new BusinessLogicException("The medico with the given id was not found", BusinessError.NOT_FOUND);
    }

    const pacienteMedico: MedicoEntity = paciente.medico.find((m) => m.id === medicoId);
    if (!pacienteMedico) {
      throw new BusinessLogicException("The medico with the given id is not associated to the paciente", BusinessError.PRECONDITION_FAILED);
    }

    paciente.medico = paciente.medico.filter((m) => m.id !== medicoId);
    await this.pacienteRepository.save(paciente);
  }
}

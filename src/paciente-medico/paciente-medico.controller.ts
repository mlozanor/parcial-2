/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MedicoEntity } from 'src/medico/medico.entity';
import { MedicoDto } from '../medico/medico.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PacienteMedicoService } from './paciente-medico.service';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) {}

    @Post(':pacienteId/medicos/:medicoId')
    async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string) {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }

    @Get(':pacienteId/medicos/:medicoId')
    async findMedicoByPacienteIdAndMedicoId(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string) {
        return await this.pacienteMedicoService.findMedicoByPacienteIdAndMedicoId(pacienteId, medicoId);
    }

    @Get(':pacienteId/medicos')
    async findMedicosByPacienteId(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteMedicoService.findMedicosByPacienteId(pacienteId);
    }

    @Put(':pacienteId/medicos')
    async associateMedicosToPaciente(@Body() medicosDto: MedicoDto[], @Param('pacienteId') pacienteId: string) {
        const medicos = plainToInstance(MedicoEntity, medicosDto);
        return await this.pacienteMedicoService.associateMedicosToPaciente(pacienteId, medicos);
    }

    @Delete(':pacienteId/medicos/:medicoId')
    @HttpCode(204)
    async deleteMedicoFromPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string) {
        return await this.pacienteMedicoService.removeMedicoFromPaciente(pacienteId, medicoId);
    }
}

/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MedicoDto } from './medico.dto';
import { MedicoEntity } from './medico.entity';
import { MedicoService } from './medico.service';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  async findAll() {
    return await this.medicoService.findAll();
  }

  @Get(':medicoId')
  async findOne(@Param('medicoId') medicoId: string) {
    return await this.medicoService.findOne(medicoId);
  }

  @Post()
  async create(@Body() medicoDto: MedicoDto) {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.create(medico);
  }

  @Put(':medicoId')
  async update(@Param('medicoId') medicoId: string, @Body() medicoDto: MedicoDto) {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.update(medicoId, medico);
  }

  @Delete(':medicoId')
  @HttpCode(204)
  async delete(@Param('medicoId') medicoId: string) {
    return await this.medicoService.delete(medicoId);
  }
}

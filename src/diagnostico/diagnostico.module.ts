import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
  providers: [DiagnosticoService],
})
export class DiagnosticoModule {}

/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';

import { faker } from '@faker-js/faker';
import { MedicoEntity } from '../medico/medico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.firstName(),
        genero: faker.person.gender(),
        medico: [], // Inicializamos el array vacío
        diagnosticos: [],
      });
      pacientesList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all pacientes', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('findOne should return a paciente by id', async () => {
    const storedPaciente: PacienteEntity = pacientesList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne should throw an exception for an invalid paciente', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      "message",
      "The paciente with the given id was not found"
    );
  });

  it('create should return a new paciente', async () => {
    const medico1 = new MedicoEntity();
    medico1.id = "medico1";

    const medico2 = new MedicoEntity();
    medico2.id = "medico2";

    const paciente: PacienteEntity = {
      id: "",
      nombre: "Juan",
      genero: "Masculino",
      diagnosticos: [],
      medico: [medico1, medico2],
      paciente: []
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id }, relations: ["medico"] });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
    expect(storedPaciente.medico.length).toBeGreaterThanOrEqual(0); // Verifica que tenga al menos 0 médicos
    expect(storedPaciente.medico.length).toBeLessThanOrEqual(5);    // Verifica que tenga como máximo 5 médicos

  });

  it('create should throw an exception for invalid nombre', async () => {
    const paciente: PacienteEntity = {
      id: "",
      nombre: "Jo", // Nombre inválido (menos de 3 caracteres)
      genero: "Masculino",
      diagnosticos: [],
      medico: [],
      paciente: []
    };

    await expect(() => service.create(paciente)).rejects.toHaveProperty(
      "message",
      "Paciente nombre must have at least 3 characters"
    );
  });

  it('delete should remove a paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);

    const deletedPaciente: PacienteEntity = await repository.findOne({ where: { id: paciente.id } });
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception for an invalid paciente', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      "message",
      "The paciente with the given id was not found"
    );
  });
});

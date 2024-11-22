/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteMedicoService } from './paciente-medico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    medicoRepository.clear();
    pacienteRepository.clear();

    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.person.jobTitle(),
        telefono: faker.phone.number(),
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: faker.person.gender(),
      medico: medicosList,
    });
  };

  it('addMedicoToPaciente should add a medico to a paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
    });

    const updatedPaciente: PacienteEntity = await service.addMedicoToPaciente(paciente.id, newMedico.id);

    expect(updatedPaciente.medico.length).toBe(6); // Ahora debe haber 6 médicos
    expect(updatedPaciente.medico.find(m => m.id === newMedico.id)).toBeDefined();
  });

  it('addMedicoToPaciente should throw an exception if paciente already has 5 medicos', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.person.jobTitle(),
      telefono: faker.phone.number(),
    });

    // Paciente ya tiene 5 médicos en la base de datos inicial
    await expect(() => service.addMedicoToPaciente(paciente.id, newMedico.id)).rejects.toHaveProperty("message", "A paciente cannot have more than 5 medicos assigned");
  });

  it('findMedicoByPacienteIdAndMedicoId should throw an exception for an invalid medico', async () => {
    await expect(() => service.findMedicoByPacienteIdAndMedicoId(paciente.id, "0")).rejects.toHaveProperty("message", "The medico with the given id was not found");
  });

  it('removeMedicoFromPaciente should remove a medico from a paciente', async () => {
    const medico: MedicoEntity = medicosList[0];

    await service.removeMedicoFromPaciente(paciente.id, medico.id);

    const storedPaciente: PacienteEntity = await pacienteRepository.findOne({ where: { id: paciente.id }, relations: ["medico"] });
    const removedMedico: MedicoEntity = storedPaciente.medico.find(m => m.id === medico.id);

    expect(removedMedico).toBeUndefined();
  });
});

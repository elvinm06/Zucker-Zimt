import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SETTINGS_ID, Settings } from './entities/settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

/** Values used the first time the settings row is created. */
const DEFAULTS: Omit<Settings, 'id' | 'updated_at'> = {
  name: 'Zucker & Zimt',
  tagline: 'Handgemachte Torten — jeder Bissen ein kleines Fest',
  whatsapp: '4915112345678',
  telegram: 'zuckerundzimt',
  instagram: 'https://instagram.com/zuckerundzimt',
  phone: '+49 151 1234 5678',
  address: 'Bäckerstraße 12, 10115 Berlin',
  hours: 'Mo–Sa, 09:00 – 19:00 Uhr',
};

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  /** Creates the row on first access, so the API never returns 404. */
  async get(): Promise<Settings> {
    const existing = await this.settingsRepository.findOne({
      where: { id: SETTINGS_ID },
    });
    if (existing) return existing;

    return this.settingsRepository.save(
      this.settingsRepository.create({ id: SETTINGS_ID, ...DEFAULTS }),
    );
  }

  async update(dto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.get();
    Object.assign(settings, dto);
    return this.settingsRepository.save(settings);
  }
}

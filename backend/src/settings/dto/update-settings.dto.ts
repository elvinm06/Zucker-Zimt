import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  tagline?: string;

  /** Digits only — wa.me rejects "+" and spaces. */
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]*$/, {
    message: 'WhatsApp-Nummer darf nur Ziffern enthalten (z. B. 4915112345678)',
  })
  @MaxLength(20)
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_]*$/, {
    message: 'Telegram-Benutzername darf nur Buchstaben, Ziffern und _ enthalten',
  })
  @MaxLength(40)
  telegram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  instagram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  hours?: string;
}

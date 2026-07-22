import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import { extname, join } from 'path';
import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UPLOADS_DIR,
  isCloudinaryEnabled,
  publicUrlFor,
  uploadToCloudinary,
} from './uploads.config';

const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Bild hochladen (max. 5 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        url: 'http://localhost:4000/uploads/uuid.png',
        filename: 'uuid.png',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Keine oder ungültige Datei' })
  @UseInterceptors(
    // Keep the file in memory so it can go to Cloudinary (a persistent,
    // CDN-backed store) instead of the host's ephemeral disk; only the local
    // dev fallback writes it to disk.
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Nur Bilddateien sind erlaubt (JPG, PNG, WebP, AVIF, GIF)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException('Keine Datei empfangen');

    // Never reuse the client filename — it can collide or escape the dir.
    const id = randomUUID();

    if (isCloudinaryEnabled()) {
      const url = await uploadToCloudinary(file.buffer, id);
      return { url, filename: id };
    }

    // Local dev fallback: persist to disk and serve from /uploads.
    const filename = `${id}${extname(file.originalname).toLowerCase()}`;
    await writeFile(join(UPLOADS_DIR, filename), file.buffer);
    return { url: publicUrlFor(filename, originOf(req)), filename };
  }
}

/**
 * Public origin the client used to reach the API. Honours the proxy headers
 * that Vercel/Render/Railway set, so uploaded images get an https URL on the
 * real host instead of the internal http://localhost the process binds to.
 * `trust proxy` is enabled in main.ts so req.protocol already reflects
 * X-Forwarded-Proto; we read X-Forwarded-Host explicitly for the host.
 */
function originOf(req: Request): string {
  const proto = req.protocol;
  const host =
    (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0] ??
    req.get('host');
  return host ? `${proto}://${host}` : '';
}

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Public — the keep-alive cron (.github/workflows/keep-alive.yml) pings
   * this to prevent Render's free-tier spin-down. Touches nothing but the
   * process itself, so a ping costs no database work.
   */
  @Get()
  @ApiOperation({ summary: 'Lebenszeichen des Servers' })
  @ApiOkResponse({ schema: { example: { status: 'ok' } } })
  get() {
    return { status: 'ok' };
  }
}

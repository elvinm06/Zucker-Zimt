import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Anmelden und JWT erhalten' })
  @ApiOkResponse({
    description: 'Token und Benutzer',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…',
        user: { id: 'uuid', username: 'admin' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Benutzername oder Passwort falsch' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** Lets the frontend check whether the token is still valid. */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Token prüfen' })
  @ApiOkResponse({ schema: { example: { id: 'uuid', username: 'admin' } } })
  @ApiUnauthorizedResponse({ description: 'Token fehlt oder ist abgelaufen' })
  me(@Req() req: any) {
    return req.user;
  }
}

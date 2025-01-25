import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  healthCheck() {
    return 'Main Gateway up and running';
  }
}

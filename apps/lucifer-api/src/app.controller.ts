import { Controller, Get } from '@nestjs/common';

// Controller
@Controller()
export class AppController {
  // Endpoints
  @Get('/')
  coverage() {
    return {};
  }
}

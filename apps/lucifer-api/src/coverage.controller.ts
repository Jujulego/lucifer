import { Controller, Get } from '@nestjs/common';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __coverage__?: any;
    }
  }
}

// Controller
@Controller()
export class CoverageController {
  // Endpoints
  @Get('__coverage__')
  coverage() {
    return { coverage: global.__coverage__ };
  }
}

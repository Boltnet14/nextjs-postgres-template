import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check database connection
      () => this.prismaHealth.pingCheck('database', this.prisma.client),

      // Check disk storage
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),

      // Check memory usage
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB

      // Check external API if needed
      // () => this.http.pingCheck('external_api', 'https://api.example.com'),
    ]);
  }
}

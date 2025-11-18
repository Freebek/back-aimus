import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListStatsDto {
  @ApiProperty({
    description:
      'Host/Server name or database name (e.g., "MIX 5x5 (1)" or "s5_dust2srv"',
    example: 'MIX 5x5 (1)',
    required: false,
  })
  @IsOptional()
  @IsString()
  host?: string; // accept friendly label or db name

  @ApiProperty({
    description: 'Search for player by name or steam ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

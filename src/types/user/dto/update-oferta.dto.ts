import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateOfertaDto {
  @ApiProperty({
    description: 'Whether the user has read the oferta rules',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  oferta_read: boolean;
}

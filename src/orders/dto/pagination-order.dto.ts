import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderStatus } from '../enum/order.enum';

export class PaginationOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Valid status are ${OrderStatus}`,
  })
  status: OrderStatus;
}

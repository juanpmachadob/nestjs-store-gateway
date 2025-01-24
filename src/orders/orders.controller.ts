import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services.config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { StatusOrderDto } from './dto/status-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('createOrder', createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() orderPaginationDto: PaginationOrderDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('status/:status')
  async findAllByStatus(
    @Param() statusOrderDto: StatusOrderDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', {
          ...paginationDto,
          status: statusOrderDto.status,
        }),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusOrderDto: StatusOrderDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send('changeOrderStatus', { id, ...statusOrderDto }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

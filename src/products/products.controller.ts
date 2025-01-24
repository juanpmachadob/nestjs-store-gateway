import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NATS_SERVICE } from 'src/config/services.config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await firstValueFrom(
        this.client.send('create_product', createProductDto),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      const product = await firstValueFrom(
        this.client.send('find_all_products', paginationDto),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.client.send('find_one_product', { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await firstValueFrom(
        this.client.send('update_product', { id, ...updateProductDto }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.client.send('delete_product', { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

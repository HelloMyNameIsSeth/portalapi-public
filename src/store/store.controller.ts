import { Controller, Get, Param } from '@nestjs/common';

const products = [
  {
    id: 1,
    title:  'Hoodie',
    handle: 'hoodie',
  },
];

const collections = [
  {
    id: 1,
    title: 'Hoodies',
    handle: 'hoodies',
  },
];

@Controller('store')
export class StoreController {
  @Get('/products/:collection?')
  async getProducts(@Param('collection') collection: string | undefined) {
    console.log(collection);
    return products;
  }

  @Get('/product/:handle')
  async getProduct(@Param('handle') handle: string) {
    return products.find((product) => product.handle === handle);
  }

  @Get('/collections')
  async getCollections() {
    return collections;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';

import configuration from '../../config';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  /**
   * Establish that the information will be awaited in dependence 0.
   */
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {
    this.client = new Redis({
      host: this.config.redis.host,
      port: Number(this.config.redis.port),
      password: this.config.redis.password,
    });
  }

  /**
   *Function responsible for verifying that there is information.
   * @param {string} key - Name of the storage folder.
   * @returns {Promise<number>} - Numerical representation of True or False.
   */
  async comprobateKey(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  /**
   * Function to obtain information in Redis.
   * @param {string} referenceWompi - Reference wompi.
   * @returns {Promise<string>}> - Data in format string.
   */
  async getData(referenceWompi: string): Promise<string> {
    try {
      const CART_KEY = `cart:${referenceWompi}`;

      return await this.client.get(CART_KEY);
    } catch (error) {
      console.error(
        `Error getting data for reference ${referenceWompi}: ${error}`,
      );
    }
  }

  /**
   * Function to save the information. In case the registration exists, it restores it.
   * @param {string} referenceWompi - Reference wompi.
   * @param {any} data - Information to save.
   */
  async saveData(body: { reference: string; product: {} }) {
    try {
      const CART_KEY = `cart:${body.reference}`;

      const REFERENCE_EXISTS = await this.getData(body.reference);

      if (REFERENCE_EXISTS) {
        await this.client.del(CART_KEY);
        const cart = JSON.parse(REFERENCE_EXISTS);
        cart.products.push(body.product);
        await this.client.set(CART_KEY, JSON.stringify(cart), 'EX', 3600);
      } else {
        const obj = {
          reference: body.reference,
          products: [body.product],
        };
        await this.client.set(CART_KEY, JSON.stringify(obj), 'EX', 3600);
      }

      return await this.getData(body.reference);
    } catch (error) {
      console.error(
        `Error save data for reference ${body.reference}: ${error}`,
      );
    }
  }

  /**
   * Function to update the information.
   * @param {string} reference - Reference wompi.
   * @param products - Information to update.
   */
  async updateAllProducts(reference: string, products: []) {
    try {
      const CART_KEY = `cart:${reference}`;

      await this.client.del(CART_KEY);

      const obj = {
        reference,
        products,
      };
      await this.client.set(CART_KEY, JSON.stringify(obj), 'EX', 3600);

      return await this.getData(reference);
    } catch (error) {
      console.error(`Error updating data for reference ${reference}: ${error}`);
    }
  }
}

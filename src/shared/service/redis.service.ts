import { Injectable } from '@nestjs/common';

import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  /**
   * Establish that the information will be awaited in dependence 0.
   */
  constructor() {
    this.client = new Redis({ db: 0 });
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
  async saveData(referenceWompi: string, data: []) {
    try {
      const CART_KEY = `cart:${referenceWompi}`;

      const REFERENCE_EXISTS = await this.comprobateKey(CART_KEY);

      if (REFERENCE_EXISTS) {
        await this.client.del(CART_KEY);
      }

      await this.client.set(CART_KEY, JSON.stringify(data), 'EX', 3600);

      return { reference: referenceWompi };
      
    } catch (error) {
      console.error(
        `Error save data for reference ${referenceWompi}: ${error}`,
      );
    }
  }

  /**
   * Function to update the information.
   * @param {string} referenceWompi - Reference wompi.
   * @param updatedData - Information to update.
   */
  async updateData(referenceWompi: string, updatedData: any) {
    try {
      const CART_DATA = JSON.parse(await this.getData(referenceWompi));

      if (CART_DATA.products.length === 0) {
        return;
      }

      const productIndex = CART_DATA.products.findIndex(
        (product) => product._id === updatedData._id,
      );

      if (productIndex !== -1) {
        Object.assign(CART_DATA.products[productIndex], updatedData);
        await this.saveData(referenceWompi, CART_DATA);
      }

      await this.saveData(referenceWompi, CART_DATA);
    } catch (error) {
      console.error(
        `Error update data for reference ${referenceWompi}: ${error}`,
      );
    }
  }
}

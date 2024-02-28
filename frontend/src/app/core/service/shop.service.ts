import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { CurrentUserService } from './current-user.service';
import { IShopData } from '../model/business';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private baseUrl = 'http://localhost:8000/shops';
  allShops: any[] = [];

  constructor(private currentUserService: CurrentUserService) {}

  private getConfig(): AxiosRequestConfig {
    const token = this.currentUserService.getToken();
    const config: AxiosRequestConfig = {};
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }

  async registerShop(shopData: IShopData) {
    const data: any = {
      name: shopData.shopName,
      type: shopData.shopType,
      address: shopData.shopAddress,
      description: shopData.shopDescription,
      image: shopData.shopImage,
      phone: shopData.shopPhone,
      email: shopData.shopEmail,
      transactionEnabled: shopData.isPiPaymentEnabled,
    };
    try {
      const response = await axios.post(`${this.baseUrl}/register`, { ...data }, this.getConfig());
      return response.data;
      // console.log('user is registering shop : ', data);
    } catch (error) {
      throw new Error('Error registering shop: ');
    }
  }

  async deleteShop(shopId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${shopId}`, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error deleting shop: ');
    }
  }

  async updateShop(shopId: string, updatedData: any) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${shopId}`, updatedData, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error updating shop: ');
    }
  }

  async addProductToShop(shopId: string, productData: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/add-product/${shopId}`, productData, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error adding product to shop: ');
    }
  }

  async getShopProducts(shopId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${shopId}`, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error getting shop products: ');
    }
  }

  async getAllShops() {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      console.log(response.data);

      return (this.allShops = response.data);
    } catch (error) {
      throw new Error('Error getting all shops: ');
    }
  }
}

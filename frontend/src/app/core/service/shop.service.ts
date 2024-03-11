import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { IShopData } from '../model/business';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  // private baseUrl = 'http://localhost:8001';
  private baseUrl = 'https://api-mapofpi.vercel.app';
  allShops: any[] = [];

  coordinates: number[] = [];
  country: string = '';
  city: string = '';
  region: string = '';

  constructor() {}

  getConfig(): AxiosRequestConfig {
    const token = localStorage.getItem('accessToken');
    const config: AxiosRequestConfig = {};

    config.headers = {
      'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Origin': 'https://mapofpi.com',
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  setUserPosition(arr: number[]) {
    this.coordinates = arr;
  }

  setCountry(name: string) {
    this.country = name;
  }

  setCity(name: string) {
    this.city = name;
  }
  setRegion(name: string) {
    this.region = name;
  }

  getUserPosition() {
    return this.coordinates;
  }

  async registerShop(shopData: IShopData) {
    const data: any = {
      name: shopData.shopName,
      type: shopData.shopType,
      address: shopData.shopAddress,
      description: shopData.shopDescription,
      image: shopData.shopImage[0],
      phone: shopData.shopPhone,
      email: shopData.shopEmail,
      transactionEnabled: shopData.isPiPaymentEnabled,
      coordinates: this.coordinates,
      country: this.country,
      city: this.city,
      region: this.region,
    };

    try {
      const response = await axios.post(`${this.baseUrl}/shops/register`, { ...data }, this.getConfig());
      return response.data;
    } catch (error: any) {
      console.log('Error while creating shop:', error);
      throw new Error(error);
    }
  }

  async deleteShop(shopId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/shops/${shopId}`, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error deleting shop: ');
    }
  }

  async updateShop(shopId: string, updatedData: any) {
    try {
      const response = await axios.patch(`${this.baseUrl}/shops/${shopId}`, updatedData, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error updating shop: ');
    }
  }

  async addProductToShop(shopId: string, productData: any) {
    const product = {
      name: productData.itemName,
      description: productData.description,
      price: productData.itemPrice,
      time: productData.prepTime,
      image: productData.image,
    };
    try {
      const response = await axios.post(`${this.baseUrl}/shops/add-product/${shopId}`, { ...product }, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error adding product to shop: ');
    }
  }

  async deleteProductFromShop(productId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/shops/products/${productId}`, { ...this.getConfig });
      return response.data;
    } catch (error) {
      throw new Error('Error adding product to shop: ');
    }
  }

  async getShopProducts(shopId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/shops/products/${shopId}`, this.getConfig());
      return response.data;
    } catch (error) {
      throw new Error('Error getting shop products: ');
    }
  }

  async getAllShops() {
    try {
      const response = await axios.get(`${this.baseUrl}/shops`);
      console.log(response.data);

      return (this.allShops = response.data.data);
    } catch (error) {
      throw new Error('Error getting all shops: ');
    }
  }

  async getShop(shopId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/shops/${shopId}`);
      // console.log(' new created shop is : ', JSON.stringify(response.data.data));
      return response.data;
    } catch (err) {
      throw new Error('Error getting shop: ');
    }
  }
}

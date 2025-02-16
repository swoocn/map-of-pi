import { Injectable } from '@angular/core';
import { Pi } from '@pinetwork-js/sdk';
import { CurrentUserService } from './current-user.service';
import { SnackService } from './snack.service';
import axios from 'axios';
import { ShopService } from './shop.service';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  baseUrl: string = 'https://api-mapofpi.vercel.app';
  // baseUrl: string = 'http://localhost:8001';
  currentUser: any;

  constructor(
    private currentUserService: CurrentUserService,
    private snackService: SnackService,
    private shopServices: ShopService,
    private geolocationService: GeolocationService,
  ) {
    this.currentUser = this.currentUserService.getCurrentUser();
  }

  signInUser = async () => {
    const authResult = await Pi.authenticate(['username', 'payments', 'wallet_address'], this.onIncompletePaymentFound);

    try {
      const location = await axios.get('https://ipapi.co/json/');

      const { data } = location;

      const coordinates = [data.latitude, data.longitude];

      this.shopServices.setUserPosition(coordinates);
      this.shopServices.setCountry(data.country_name);
      this.shopServices.setCity(data.city);
      this.shopServices.setRegion(data.region);
      this.geolocationService.setInitialCoordinates(coordinates);

      const userData = {
        country: data.country_name,
        city: data.city,
        region: data.region,
      };

      const response = await axios.post(`${this.baseUrl}/user/signin`, {
        authResult,
        userData,
      });
      const { currentUser, token } = response.data;
      this.currentUserService.setCurrentUser(currentUser);
      localStorage.setItem('accessToken', token);

      this.snackService.showMessage(`Welcome ${currentUser.username}! We have been expecting you. 😊`);

      return { currentUser, token };
    } catch (error) {
      console.error('Error during sign-in:', error);

      throw error;
    }
  };

  signOutUser = async () => {
    localStorage.removeItem('accessToken');
    await axios.post(`${this.baseUrl}/user/signout`);
  };

  onIncompletePaymentFound = (payment: any) => {
    console.log('onIncompletePaymentFound', payment);

    const token = localStorage.getItem('accessToken');

    return axios.post(
      `${this.baseUrl}/payments/incomplete`,
      { payment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  };

  onReadyForServerApproval = (paymentId: any) => {
    console.log('onReadyForServerApproval', paymentId);

    const token = localStorage.getItem('accessToken');

    axios.post(
      `${this.baseUrl}/payments/approve`,
      { paymentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  };

  onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log('onReadyForServerCompletion', paymentId, txid);

    const token = localStorage.getItem('accessToken');

    axios.post(
      `${this.baseUrl}/payments/complete`,
      { paymentId, txid },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  };

  onCancel = (paymentId: any) => {
    console.log('onCancel', paymentId);
    return axios.post(`${this.baseUrl}/payments/cancelled_payment`, {
      paymentId,
    });
  };

  onError = (error: any, payment: any) => {
    console.log('onError', error);
    if (payment) {
      console.log(payment);
    }
  };

  orderProductFromShop = async (memo: string, amount: number, paymentMetadata: any) => {
    const paymentData = {
      amount,
      memo,
      metadata: paymentMetadata,
      uid: 'tyes',
    };

    const callbacks = {
      onReadyForServerApproval: this.onReadyForServerApproval,
      onReadyForServerCompletion: this.onReadyForServerCompletion,
      onCancel: this.onCancel,
      onError: this.onError,
    };

    try {
      const payment = Pi.createPayment(paymentData, callbacks);
      console.log('This is payment created : ', payment);

      return payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  };
}

// const res = await userInitiateDeposit('pie cake', 10, {
//   productId: 'Deposting',
// });

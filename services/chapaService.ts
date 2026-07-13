import { ApiResponse, Bank } from '../types';

export const chapaService = {
  async initializeTransaction(payload: {
    amount: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    tx_ref: string;
  }): Promise<ApiResponse<{ checkout_url: string; _simulation?: boolean; tx_ref?: string }>> {
    try {
      const response = await fetch('/api/chapa/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          currency: 'ETB', // Preset currency
          callback_url: 'https://webhook.site/test', // Mock callback
          return_url: `${window.location.origin}/dashboard/user?tx_ref=${payload.tx_ref}&status=success`, // URL user returns to
        }),
      });

      const data = await response.json();
      return data as ApiResponse<{ checkout_url: string }>;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to initialize transaction',
      };
    }
  },

  async verifyTransaction(tx_ref: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/chapa/verify/${tx_ref}`);
      const data = await response.json();
      return data as ApiResponse<any>;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to verify transaction',
      };
    }
  },

  async fetchBanks(): Promise<ApiResponse<Bank[]>> {
    try {
      const response = await fetch('/api/chapa/banks');
      const data = await response.json();
      return data as ApiResponse<Bank[]>;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to fetch banks list',
      };
    }
  },

  async verifyTransfer(ref: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/chapa/transfer-verify/${ref}`);
      const data = await response.json();
      return data as ApiResponse<any>;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to verify transfer',
      };
    }
  },
};

export type Role = 'user' | 'admin' | 'super_admin';


export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean; 
}

export interface Transaction {
  id: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  tx_ref: string;
}

export interface Bank {
  id: string;
  name: string;
  code?: string;
  acronym?: string;
}


export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

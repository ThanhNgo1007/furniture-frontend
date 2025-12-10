export interface Address {
  id?: number
  name: string
  mobile: string
  pinCode: string
  address: string
  locality: string
  city: string
  ward: string
}

export const UserRole = {
  ROLE_CUSTOMER: 'ROLE_CUSTOMER',
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_SELLER: 'ROLE_SELLER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id?: number
  password?: string
  email: string
  fullName: string
  mobile?: string
  role: UserRole
  addresses: Address[]
}

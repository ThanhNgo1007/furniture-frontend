export interface PickupAddress {
  name: string
  mobile: string
  pincode: string
  address: string
  locality: string
  city: string
  ward: string
}

export interface BanksDetails {
  accountNumber: string
  accountHolderName: string
  swiftCode: string
}

export interface BusinessDetails {
  businessName: string
}

export interface Seller {
  id?: number
  mobile: string
  otp: string
  MST: string
  pickupAddress: PickupAddress
  bankDetails: BanksDetails
  sellerName: string
  email: string
  businessDetails: BusinessDetails
  password: string
  accountStatus?: string
}

export interface SellerReport {
  id: number
  seller: string
  totalEarnings: number
  totalSales: number
  totalRefunds: number
  totalTax: number
  netEarnings: number
  totalOrders: number
  canceledOrders: number
  totalTransactions: number
}

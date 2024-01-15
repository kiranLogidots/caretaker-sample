import { CouponType } from '@/config/enums';

export interface CreateUserResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: ResponseData[];
}

export interface ResponseData {
  id: number;
  user_type: string;
  name: string;
  phone: string;
  age: number;
  password: string;
  created_by: number;
  roles: RolesResponse[];
  created_at: string;
  updated_at: string;
}

export interface RolesResponse {
  id: number;
  name: string;
}

export interface ListCollectionInterface {
  status: boolean;
  message: string;
  statusCode: number;
  data: ListData[];
  pagination: Pagination[];
}
export interface ListData {
  id: number;
  name: string;
  point_type: string;
  district_id: number;
}

export interface Pagination {
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPage: number;
}
export interface CollectionPointOption {
  value: number;
  label: string;
}
export interface AdminLogin {
  PhoneOrEmail: string;
  password: string;
}
export interface CreateHSK {
  user_type: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  password: string;
  confirm_password: string;
}
export interface CreateCluster {
  user_type: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  password: string;
  confirm_password: string;
}
export interface CreateDriver {
  user_type: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  password: string;
  confirm_password: string;
}
export interface CreatePA {
  user_type: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  password: string;
  confirm_password: string;
}
export interface AssignCollectionPoints{
  user_id:number;
  collectionPointIds:number[];
}
export interface CreateEvent {
  name: string;
  expense: number;
  date: Date;
}

export interface CreateUserResponse{
  status:boolean;
  message:string;
  statusCode:number;
  data:ResponseData[];
}

export interface ResponseData{
  id:number;
  user_type:string;
  name:string;
  phone:string;
  age:number;
  password:string;
  created_by:number;
  roles:RolesResponse[];
  created_at:string;
  updated_at:string;
}

export interface RolesResponse{
  id:number;
  name:string;
}

export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  slug: string;
  amount?: string;
  code?: string;
}

export interface Address {
  customerName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  street?: string;
}

export interface GoogleMapLocation {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export type ProductColor = {
  name?: string;
  code?: string;
};

export interface CartItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  color?: ProductColor | null;
  price: number;
  salePrice?: number;
  quantity: number;
  size: number;
  stock?: number;
  discount?: number;
}

export type Product = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail: string;
  colors?: ProductColor[];
  sizes?: number[];
  base64?: string;
};

export type PosProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
  base64?: string;
};
export interface CalendarEvent {
  id?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  description?: string;
  location?: string;
}

export interface FlightingCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  meta?: {
    model: string;
    hours: string;
    stop: string;
  };
  class: string;
  bucket: {
    luggage?: string;
    bag?: string;
  };
  airlines?: string;
  routes?: {
    arrivalDate: Date | string;
    arrivalTime: Date | string;
    departureDate: Date | string;
    departureTime: Date | string;
    departureCityCode: string;
    departureCity: string;
    departureTerminal: string;
    arrivalCityCode: string;
    arrivalCity: string;
    arrivalTerminal: string;
    layover: {
      layoverCityCode: string;
      layoverCity: string;
      layoverTerminal: string;
      layoverTime: string;
    }[];
  };
  cheapest?: boolean;
  best?: boolean;
  quickest?: boolean;
}

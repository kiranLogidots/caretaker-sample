import { CouponType } from '@/config/enums';

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

export interface ListIndustryInterface {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface ListPositionCategoryInterface {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
// export interface ListOrganizationInterface {
//   data : ListOrganizationData[];
// }

export interface AccountType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Interface for industry type
export interface IndustryType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Interface for organization user
export interface OrganizationUser {
  id: number;
  role: string;
  organization_id: number;
  organization_branch_id: number | null;
  role_id: number;
  user_id: string;
  primary_location: string | null;
  onboarded_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Interface for organization
export interface Organization {
  id: number;
  account_type_id: number;
  industry_type_id: number;
  organization_super_admin_id: number | null;
  company_name: string;
  country: string;
  postal_code: string;
  company_address_line_one: string;
  company_address_line_two: string;
  work_phone: string;
  work_email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  accountType: AccountType;
  industryType: IndustryType;
  organizationUsers: OrganizationUser[];
}

export interface Position {
  created_at: string;
  deleted_at: string | null;
  description: string;
  hourly_rate: string;
  id: number;
  name: string;
  position_category_id: number;
  updated_at: string;
}

export interface ListOrgPositionInterface {
  created_at: string;
  deleted_at: string | null;
  hourly_rate: string;
  id: number;
  organization: Organization;
  organization_id: number;
  position: Position;
  position_id: number;
  updated_at: string;
}

// Meta data interface
export interface Meta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [string, string][];
}

// Links interface
export interface Links {
  current: string;
}
export interface CreateDepartments {
  organization_branch_id: number;
  name: string;
  description: string;
}
export interface DepartmentResponseInterface {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  organization_branch_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Main response interface
export interface ListOrganisationResponse {
  data: Organization[];
  meta: Meta;
  links: Links;
}
export interface ListOrganizationData {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface ListAccountInterface {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface ListPositionsInterface {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Branch {
  id: number;
  branch_name: string;
  organization_id: number;
  location_name: string | null;
  location_address_line_one: string;
  location_address_line_two: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface Meta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [string, string][];
}

export interface Links {
  current: string;
}

export interface ListBranchesInterface {
  data: Branch[];
  meta: Meta;
  links: Links;
}
export interface HKSUsers {
  id: number;
  user_type: string;
  name: string;
  phone: string;
  age: number;
  email: string;
  address: string;
  password: string;
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface HKSUsersResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: HKSUsers[];
  pagination: {
    totalCount: number;
    currentPage: number;
    perPage: number;
    totalPage: number;
  };
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
export interface DriversListData {
  value: number;
  label: string;
}
export interface AdminLogin {
  email: string;
  password: string;
}

export interface CreateUser {
  name: string;
  age: number;
  address: string;
  phone: string;
  password: string;
  confirm_password: string;
}
export interface CreateOrg {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  industry_type_id: number;
  account_type_id: number;
  company_name: string;
  company_address_line_one: string;
  company_address_line_two: string;
  country: string;
  postal_code: string;
  work_phone: string;
  work_email: string;
}
export interface CreatePositionCat {
  name: string;
  description: string;
}
export interface CreatePositions {
  name: string;
  description: string;
  position_category_id: number;
  hourly_rate: number;
}
export interface CreateDepartments {
  description: string;
  name: string;
  organization_branch_id: number;
}
export interface CreateBranches {
  branch_admin: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  branch_name: string;
  location_address_line_one: string;
  location_address_line_two: string;
  country: string;
  postal_code: string;
  organization_id: number;
}
export interface CreateStaffs {
  positions: StaffsPositions[];
  first_name: string;
  last_name: string;
  email: string;
  organization_id: number;
  organization_branch_id: number;
  primary_location: string;
  employee_id: string;
  employee_start_date: string;
  employment_status: string;
  dob: string;
}

export interface StaffsPositions {
  position_id: number;
  hourly_rate: number;
  is_primary: number;
}
export interface CreatePositionCatResponse {
  name: string;
  description: string;
  id: number;
}
export interface CreatePositionUnderOrgResponse {
  position_id: number;
  hourly_rate: number;
  organization_id: number;
}
export interface CreatePositionsUnderOrg {
  organization_positions: {
    organization_id: number;
    position_id: number;
    hourly_rate: number;
  }[];
}
export interface CreateStaffResponse {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: {
    id: number;
    name: string;
    created_at: string;
  }[];
  email_verified_at: string | null;
  remember_token: string | null;
  dob: string | null;
  profile_pic: string | null;
  employee_start_date: string | null;
  employment_status: string | null;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_active: boolean;
  employee_id: string | null;
}
export interface AssignCollectionPoints {
  user_id: number;
  collectionPointIds: number[];
}

export interface JobRequestResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: JobRequestResponseData;
}
export interface JobRequestResponseData {
  id: number;
  material_type: string;
  weight: string;
  collection_point_id: number;
  driver_id: number;
  status_id: number;
  collection_point_data: CollectionPointData;
  driver_data: DriverData;
  date: string;
  status: {
    id: number;
    name: string;
    desc: string;
    order: number;
    type: string;
  };
}

export interface JobTrackingResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: JobTrackingResponseData[];
}

export interface JobTrackingResponseData {
  id: number;
  job_id: number;
  driver_id: number;
  status_id: number;
  file: string;
  note: string;
  time: Date;
  location_lattitude: string;
  location_longitude: string;
  weight: number;
  status: TrackingStatus;
  images: TrackingImages[];
}
export interface TrackingStatus {
  id: number;
  name: string;
  desc: string;
  order: number;
  type: string;
}
export interface TrackingImages {
  id: number;
  image: string;
  job_tracking_id: number;
  imgUrl: string;
}
export interface DriverData {
  id: number;
  user_type: string;
  name: string;
  phone: string;
  age: number;
  email: string;
  address: string;
  password: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  otp_secret: number;
  otp_timestamp: number;
  profile_image: string;
}
export interface CollectionPointData {
  id: number;
  name: string;
  address: string;
  point_type: string;
  district_id: number;
  no_of_wards: number;
}
export interface AddWardData {
  date: string;
  collection_point_id: number;
  ward_no: string;
  hks_team_name: string;
  shop_visited: number;
  shop_paid: number;
  shop_vacant: number;
  house_visited: number;
  house_paid: number;
  house_denied: number;
  house_vacant: number;
  house_not_intrested: number;
  house_w_no_money: number;
  collection_amt: number;
  hks_incentive: number;
}
export interface InitiateJobsRequest {
  collection_point_id: number;
  driver_id: number;
  materialType: string;
  date: string;
  approximateWeight: number;
}

export interface CreateUserResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    name: string;
    address: string;
    id: number;
    primary_contact_name: string;
    primary_contact_email: string;
    primary_contact_phone: string;
  };
}

export interface CreatePositionResponse {
  id: number;
  name: string;
  description: string;
  hourly_rate: number;
  position_category_id: number;
  positionCategory: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
}
export interface CreatePositionCatResponse {
  id: number;
  name: string;
  description: string;
}
export interface EventResponseData {
  id: any;
  name: string;
  description: string;
}

export interface HKSEvents {
  id: number;
  name: string;
  expense: string;
  date: Date;
}

export interface HKSEventsResponse {
  id: number;
  name: string;
  description: string;
}
export interface HKSEventsResponse {
  id: number;
  name: string;
  description: string;
}
export interface JobsListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: JobsList[];
  pagination: {
    totalCount: number;
    currentPage: number;
    perPage: number;
    totalPage: number;
  };
}
export interface JobsList {
  id: number;
  material_type: string;
  weight: string;
  collection_point_id: number;
  driver_id: number;
  status_id: number;
  collection_point_data: {
    id: number;
    name: string;
    point_type: string;
    district_id: number;
  };
  driver_data: {
    id: number;
    user_type: string;
    name: string;
    phone: string;
    age: number;
    email: string;
    address: string;
    password: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    otp_secret: null;
    otp_timestamp: null;
    profile_image: null;
  };
  created_by: number;
  date: string;
  created_at: string;
  updated_at: string;
  status: {
    id: number;
    name: string;
    desc: string;
    order: number;
    type: string;
  };
}

export interface RolesResponse {
  id: number;
  name: string;
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

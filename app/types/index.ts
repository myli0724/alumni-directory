// Alumni list response types
export interface AlumniListResponse {
  code: number;
  msg: string;
  data: AlumniListData;
}

export interface AlumniListData {
  total: number;
  size: number;
  current: number;
  records: AlumniRecord[];
  pages: number;
}

export interface AlumniRecord {
  memberLeadingId: number;
  leadingId: number;
  levelId: number;
  levelName: string;
  typeId: number | null;
  typeCode: string | null;
  typeName: string | null;
  leadingName: string;
  leadingAvatar: string;
  leadingSocialPosition: string | null;
  memberId: number;
  orgCompanyId: number;
  companyName: string | null;
  companyLogo: string | null;
  companyAddressStr: string;
  companyMainBusiness: string;
  companyMainBusinesList: any[];
  companyFoundTime: string | null;
  tenantId: number;
  orgTenantName: string;
  applyType: number;
  currentDistance: string | null;
  distance: string | null;
  memberState: number;
  attention: boolean;
  unlockLeading: boolean;
  saasMerchantIsEnable: boolean;
  orderCode: string | null;
  imUserId: string | null;
  postId: string | null;
  postName: string | null;
  joinTime: string;
  createTime: string | null;
  appUserId: string | null;
}

// Alumni details response types
export interface AlumniDetailsResponse {
  code: number;
  msg: string;
  data: AlumniDetails;
}

export interface AlumniDetails {
  id: number;
  cocId: number;
  applyType: number;
  leaderId: number;
  name: string;
  avatar: string | null;
  socialPosition: string | null;
  phone: string | null;
  wechatId: string | null;
  personalHonorList: any[];
  video: string | null;
  videoCover: string | null;
  socialIdentityList: any[];
  imgList: any[];
  email: string | null;
  companyName: string | null;
  companyAddress: string | null;
  companyTel: string | null;
  companyPositionName: string | null;
  briefIntroduction: string | null;
  companiesDtoList: CompanyDto[];
  display: any | null;
  share: string;
  appUserId: string | null;
  isUpdate: boolean;
  mobileDisplay: number;
  emailDisplay: number;
  wechatIdDisplay: number;
  addressDisplay: number;
  browseInfo: BrowseInfo;
  isMemberCoupon: boolean;
  memberLeadingId: number;
  tenantId: number;
  orgTenantName: string;
  attention: boolean;
  unlockLeading: boolean;
  unlockContact: boolean;
  orderCode: string | null;
  saasMerchantIsEnable: boolean;
  orgCompanyId: number;
  productLibIds: string | null;
  isSystem: boolean;
}

export interface CompanyDto {
  id: string | null;
  leaderId: string | null;
  appUserInfoId: string | null;
  name: string;
  logo: string | null;
  position: string | null;
  tel: string | null;
  addressStr: string | null;
  mainBusinessList: any[];
  socialIdentityList: any[];
  imgList: any[];
  introduce: string | null;
  documentName: string | null;
  documentCover: string | null;
  document: string | null;
  video: string | null;
  videoCover: string | null;
  isMaster: number;
  authentication: boolean;
  isShow: boolean | null;
}

export interface BrowseInfo {
  avaList: string[];
  browseNum: string;
}

// Search parameters
export interface SearchParams {
  current: number;
  size: number;
  mapType: number;
  keyword: string;
  assType: number;
  contactsType: number;
  typeId: number[];
  levelId: number[];
  industryId: number[];
  areaId: number[];
  currentLatitude: number;
  currentLongitude: number;
}

// Graduation years mapping
export interface GraduationYear {
  id: number;
  year: string;
} 
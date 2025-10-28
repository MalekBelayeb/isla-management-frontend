export interface CurrentTripEmployeeDetails {
  idRoom: string;
  status: string;
  pickup: {
    startTime: number;
    destinationAdress?: string;
    societyAdress?: string;

    destinationLat: number;
    destinationLng: number;
    isPickup: boolean;
  };
  intermediates: {
    destinationAdress: string;
    destinationLat: number;
    destinationLng: number;
    isIntermediate: boolean;
  }[];
  dropoff: {
    startTime: number;
    destinationAdress?: string;
    societyAdress?: string;
    destinationLat: number;
    destinationLng: number;
    isPickup: boolean;
  };
  totalPrice: number;
}

export interface UserAddressItem {
  id: string;
  label: string;
  location: {
    labelTarget: string;
    mainTarget: string;
    sencondaryTarget: string;
    lat: number;
    lng: number;
    isSociety: boolean;
    type: string[];
  };
  active: false;
}

export interface EmployeeDetails {
  fullname: string;
  firstname: string;
  lastname: string;
  address: string;
  phoneNumber: string;
  type: string;
  email: string;
  cin: string;
  group: string;
  createdAt: Date;
  lat: number;
  long: number;
  groupId: string;
  siteId: string;
  activityId: string;
  employeeId: string;
  site: string;
  activity: string;
  departureFromHome: any;
  arrivalAtHome: any;
  stopLocation: string;
  currentTrip?: CurrentTripEmployeeDetails;
  addressNumber: number;
  attachment: boolean;
  userAddresses: UserAddressItem[];
  userPacket: {
    packetId: string;
    packetName: string;
    limitType: string;
    value: number;
    remainingValue: number;
  };
}

export interface Employee {
  id: string;
  fullname: string;
  phoneNumber: string;
  departureTime: string;
  arrivalTime: string;
  activeAddress: string;
  email: string;
  type: 'shared' | 'exclusive';
  group: string;
  site: string;
  shiftId: string;
  activity: string;
  employeeId: string;
  vehicleType?: 'taxi' | 'bus' | 'mix';
  arrivalTransportType?: string;
  departureTransportType?: string;
  stopLocation?: string;
  status?: 'onhold' | 'verified' | 'unverified';
  userPacket?: {
    packetId: string;
    packetName: string;
    limitType: string;
    value: number;
    remainingValue: number;
  };
}

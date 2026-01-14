export enum JourneyStage {
  INTERESSENT = 'INTERESSENT',
  KUNDE = 'KUNDE',
  VIP = 'VIP',
  AMBASSADOR = 'AMBASSADOR'
}

export interface Client {
  id: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city: string;
  address?: string;
  zipCode?: string;
  country?: string;
  journeyStage: JourneyStage;
  statusText: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  clientId: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE';
  title: string;
  description?: string;
  date: Date;
  createdBy: string;
}

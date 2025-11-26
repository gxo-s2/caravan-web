import { Caravan } from './caravan';

export type Reservation = {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  caravan: Caravan;
};
export interface iBookingResponse {
  _id: string;
  user: User;
  tour: Tour;
  guest: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  payment: Payment;
}

export interface iBooking {
  tour: string;
  guest: number;
}

interface User {
  _id: string;
  name: Name;
  email: string;
}

interface Name {
  firstName: string;
  lastName: string;
}

interface Tour {
  _id: string;
  title: string;
  costFrom: number;
  startDate: string;
  endDate: string;
}

interface Payment {
  _id: string;
  TrxID: string;
  amount: number;
  status: string;
}

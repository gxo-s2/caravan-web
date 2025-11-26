export interface User {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  rating: number | null;
  isVerified: boolean;
}

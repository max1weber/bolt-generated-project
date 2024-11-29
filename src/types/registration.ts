export interface RegistrationForm {
  macAddress: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface DeviceValidation {
  isValid: boolean;
  message?: string;
}

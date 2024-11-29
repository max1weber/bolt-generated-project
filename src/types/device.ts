export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  lastRegistered: string;
}

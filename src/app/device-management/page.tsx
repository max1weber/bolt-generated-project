'use client';

import { useState } from 'react';
import { Device } from '@/types/device';
import DeviceForm from '@/components/DeviceForm';
import DeviceList from '@/components/DeviceList';

export default function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);

  const handleRegister = (deviceData: Omit<Device, 'id' | 'lastRegistered'>) => {
    const newDevice: Device = {
      ...deviceData,
      id: Math.random().toString(36).substr(2, 9),
      lastRegistered: new Date().toLocaleString(),
    };
    setDevices([...devices, newDevice]);
  };

  const handleDelete = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Device Management</h1>
      <div className="max-w-md">
        <DeviceForm onSubmit={handleRegister} />
      </div>
      <DeviceList devices={devices} onDelete={handleDelete} />
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RegistrationForm as RegistrationFormType } from '@/types/registration';
import { validateDeviceId, registerUser } from '@/lib/api';

const schema = yup.object({
  macAddress: yup
    .string()
    .required('MAC address is required')
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
}).required();

interface Props {
  deviceId: string;
}

export default function RegistrationForm({ deviceId }: Props) {
  console.log('[RegistrationForm] Initializing with deviceId:', deviceId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegistrationFormType) => {
    console.log('[RegistrationForm] Form submitted with data:', { ...data, password: '***' });
    
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('[RegistrationForm] Validating deviceId:', deviceId);
      const validation = await validateDeviceId(deviceId);
      console.log('[RegistrationForm] Device validation result:', validation);

      if (!validation.isValid) {
        throw new Error(validation.message || 'Invalid device ID');
      }

      console.log('[RegistrationForm] Registering user with Keycloak');
      await registerUser(data, deviceId);
      console.log('[RegistrationForm] User registration successful');
      
      setSuccess(true);
    } catch (err: any) {
      console.error('[RegistrationForm] Error during registration:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('[RegistrationForm] Rendering with errors:', errors);

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <p className="text-green-700">Registration successful! You can now log in to the system.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="macAddress" className="block text-sm font-medium">
          MAC Address
        </label>
        <input
          type="text"
          id="macAddress"
          {...register('macAddress')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="00:11:22:33:44:55"
          onChange={(e) => {
            console.log('[RegistrationForm] MAC address changed:', e.target.value);
            register('macAddress').onChange(e);
          }}
        />
        {errors.macAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.macAddress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          {...register('firstName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          {...register('lastName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register('username')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

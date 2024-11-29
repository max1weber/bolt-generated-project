import axios from 'axios';
import { DeviceValidation } from '@/types/registration';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
const KEYCLOAK_ADMIN_CLIENT_SECRET = process.env.KEYCLOAK_ADMIN_CLIENT_SECRET;

export async function validateDeviceId(deviceId: string): Promise<DeviceValidation> {
  console.log('[API] Validating deviceId:', deviceId);
  console.log('[API] Using API URL:', API_BASE_URL);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/devices/validate/${deviceId}`);
    console.log('[API] Validation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Validation error:', error);
    return { isValid: false, message: 'Failed to validate device' };
  }
}

export async function registerUser(userData: any, deviceId: string) {
  console.log('[API] Registering user for deviceId:', deviceId);
  console.log('[API] User data:', { ...userData, password: '***' });
  
  try {
    console.log('[API] Getting admin token from Keycloak');
    const tokenResponse = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: KEYCLOAK_CLIENT_ID!,
        client_secret: KEYCLOAK_ADMIN_CLIENT_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const adminToken = tokenResponse.data.access_token;
    console.log('[API] Admin token received');

    console.log('[API] Creating user in Keycloak');
    const userResponse = await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
      {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
        credentials: [{
          type: 'password',
          value: userData.password,
          temporary: false
        }],
        attributes: {
          deviceId: [deviceId],
          macAddress: [userData.macAddress]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[API] User created successfully');
    return userResponse.data;
  } catch (error) {
    console.error('[API] Error registering user:', error);
    throw new Error('Failed to register user');
  }
}

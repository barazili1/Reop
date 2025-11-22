export enum KeyType {
  PERMANENT = 'PERMANENT',
  TEMPORARY = 'TEMPORARY',
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  description: string;
  type: KeyType;
  createdAt: number;
  expiresAt?: number; // Only for temporary keys
  lastUsed?: number;
  isActive: boolean;
}

export interface CreateKeyFormData {
  name: string;
  description: string;
  type: KeyType;
  durationHours?: number; // For temporary keys
  keyString?: string; // Explicitly generated key string from UI
}
/**
 * API Contract for LabourApp
 * This file defines all API endpoints and data structures used in the application.
 * Use this as a reference for implementing the backend services.
 */

// User-related types
export interface UserDTO {
  id: string;
  name: string;
  phoneNumber: string;
  occupation: OccupationType;
  profileImage?: string;
  language?: string;
  gender?: 'Male' | 'Female' | 'Other';
  location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rating?: number;
  totalJobs?: number;
  activeMonths?: number;
  createdAt: string;
  updatedAt: string;
}

export type OccupationType = "I NEED LABOUR/MISTRY" | "I'M LABOUR" | "I'M MISTRY";

// Job-related types
export interface JobDTO {
  id: string;
  title: string;
  wage: number;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  type: JobType;
  postedBy: string; // User ID
  status: JobStatus;
  applicants?: string[]; // Array of User IDs
  hiredWorker?: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'MASONRY' | 'CARPENTER' | 'PAINTER' | 'LABOUR';
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Chat-related types
export interface MessageDTO {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatDTO {
  id: string;
  participants: string[]; // Array of User IDs
  lastMessage?: MessageDTO;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Endpoints
 * Base URL: https://api.labourapp.com/v1
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SEND_OTP: 'POST /auth/send-otp',
    VERIFY_OTP: 'POST /auth/verify-otp',
    REFRESH_TOKEN: 'POST /auth/refresh-token',
  },

  // User Management
  USERS: {
    CREATE: 'POST /users',
    GET: 'GET /users/:id',
    UPDATE: 'PUT /users/:id',
    UPDATE_LOCATION: 'PUT /users/:id/location',
    UPDATE_PROFILE_IMAGE: 'PUT /users/:id/profile-image',
  },

  // Jobs
  JOBS: {
    CREATE: 'POST /jobs',
    GET_ALL: 'GET /jobs',
    GET_BY_ID: 'GET /jobs/:id',
    UPDATE: 'PUT /jobs/:id',
    DELETE: 'DELETE /jobs/:id',
    APPLY: 'POST /jobs/:id/apply',
    GET_APPLICATIONS: 'GET /jobs/:id/applications',
    HIRE_WORKER: 'POST /jobs/:id/hire',
    COMPLETE_JOB: 'PUT /jobs/:id/complete',
    CANCEL_JOB: 'PUT /jobs/:id/cancel',
    SEARCH: 'GET /jobs/search',
  },

  // Chat
  CHAT: {
    CREATE: 'POST /chats',
    GET_ALL: 'GET /chats',
    GET_BY_ID: 'GET /chats/:id',
    SEND_MESSAGE: 'POST /chats/:id/messages',
    GET_MESSAGES: 'GET /chats/:id/messages',
    MARK_AS_READ: 'PUT /chats/:id/read',
  },
} as const;

/**
 * Request/Response Examples
 */
export const API_EXAMPLES = {
  // Authentication Examples
  'POST /auth/send-otp': {
    request: {
      phoneNumber: '+919876543210',
    },
    response: {
      success: true,
      message: 'OTP sent successfully',
      requestId: 'abc123', // Used for verifying OTP
    },
  },

  'POST /auth/verify-otp': {
    request: {
      requestId: 'abc123',
      otp: '123456',
      deviceId: 'device123',
    },
    response: {
      success: true,
      accessToken: 'jwt_token_here',
      refreshToken: 'refresh_token_here',
      user: 'UserDTO',
    },
  },

  // Jobs Examples
  'POST /jobs': {
    request: {
      title: 'MASONRY WORK',
      wage: 500,
      location: {
        address: 'Construction Site, Ranchi',
        coordinates: {
          latitude: 23.3441,
          longitude: 85.3096,
        },
      },
      description: 'Need experienced mason for construction work',
      type: 'MASONRY',
    },
    response: 'JobDTO',
  },

  'GET /jobs/search': {
    request: {
      query: {
        type: 'MASONRY',
        latitude: 23.3441,
        longitude: 85.3096,
        radius: 5000, // Search radius in meters
        minWage: 400,
        maxWage: 1000,
      },
    },
    response: {
      jobs: 'JobDTO[]',
      total: 10,
      page: 1,
      pageSize: 20,
    },
  },
};

/**
 * Error Responses
 * All API endpoints may return these error responses
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'AUTH001',
  INVALID_OTP: 'AUTH002',
  OTP_EXPIRED: 'AUTH003',
  USER_NOT_FOUND: 'USER001',
  JOB_NOT_FOUND: 'JOB001',
  INVALID_JOB_STATUS: 'JOB002',
  CHAT_NOT_FOUND: 'CHAT001',
  VALIDATION_ERROR: 'VAL001',
  RATE_LIMIT_EXCEEDED: 'RATE001',
  INTERNAL_SERVER_ERROR: 'SRV001',
} as const;
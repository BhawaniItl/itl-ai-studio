import { mockResponse } from "./api/api";

/**
 * Auth service — all mock. Replace only these implementations later.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  firm?: string;
  address?: string;
  telephone?: string;
  fax?: string;
}

export const authService = {
  login: (email: string, _password: string, remember: boolean) =>
    mockResponse({ ok: true, token: "mock.jwt", email, remember }, 500),
  register: (payload: RegisterPayload) =>
    mockResponse({ ok: true, userId: crypto.randomUUID(), email: payload.email }, 600),
  requestPasswordOtp: (email: string) => mockResponse({ ok: true, email }, 400),
  verifyPasswordOtp: (email: string, otp: string) =>
    mockResponse({ ok: otp.length === 6, email }, 400),
  resetPassword: (email: string, _password: string) => mockResponse({ ok: true, email }, 400),
  requestEmailOtp: (email: string) => mockResponse({ ok: true, email }, 400),
  verifyEmailOtp: (email: string, otp: string) =>
    mockResponse({ ok: otp.length === 6, email }, 400),
};

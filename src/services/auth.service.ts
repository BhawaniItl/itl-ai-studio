/* eslint-disable prettier/prettier */
import { api, endpoints } from "./api/api";
import { useAuthStore } from "@/store/authStore";

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
  async login(email: string, password: string, remember: boolean) {
    const { data } = await api.post(endpoints.auth.login, {
      email,
      password,
      remember,
    });

    if (data.access_token) {
      useAuthStore.getState().setSession(
        data.user,
        data.access_token,
      );
    }

    return data;
  },

  async register(payload: RegisterPayload) {
    const { data } = await api.post(endpoints.auth.register, {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      mobile: payload.mobile,
      city: payload.city,
      state: payload.state,
      pin_code: payload.pincode,
      firm: payload.firm,
      address: payload.address,
      telephone: payload.telephone,
      fax: payload.fax,
    });

    return data;
  },

  async logout() {
    try {
      await api.post(endpoints.auth.logout);
    } finally {
      useAuthStore.getState().clear();
    }
  },

  async me() {
    const { data } = await api.get(endpoints.auth.me);
    return data;
  },

  // OTP flows are not wired to the backend yet. Signatures match the call
  // sites so the UI compiles and fails loudly instead of silently.
  async requestPasswordOtp(_email: string): Promise<void> {
    throw new Error("Not implemented");
  },

  async verifyPasswordOtp(_email: string, _otp: string): Promise<{ ok: boolean }> {
    throw new Error("Not implemented");
  },

  async resetPassword(_email: string, _password: string): Promise<void> {
    throw new Error("Not implemented");
  },

  async requestEmailOtp(_email: string): Promise<void> {
    throw new Error("Not implemented");
  },

  async verifyEmailOtp(_email: string, _otp: string): Promise<{ ok: boolean }> {
    throw new Error("Not implemented");
  },
};
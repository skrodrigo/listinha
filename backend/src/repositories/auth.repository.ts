import { auth } from '@/common/auth.js';
import type { RegisterData } from '@/dtos/auth.dto.js';

export const authRepository = {
  async createUser(data: RegisterData) {
    const { email, password } = data;
    return await auth.api.signUpEmail({
      body: { email, password, name: email.split('@')[0] },
      asResponse: true
    });
  },
};

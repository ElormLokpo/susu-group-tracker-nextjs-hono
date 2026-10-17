export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type VerifyEmailRequest = {
  email: string | undefined;
  code: string;
};

export type EmailType = {
  email: string;
};

export type AuthResponseType = {
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: string;
  };
  token: string;
};

export type VerifyUserResponseType = {
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: string;
  };
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  email: string;
};



export type OauthRequest = {
  name: string;
  email: string;
  email_verified: boolean;
};

//

export interface iLogin {
  email: string;
  password: string;
}

export interface iSendOtp {
  email: string;
}

export interface iVerifyOtp {
  otp: string;
  email: string;
}

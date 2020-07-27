interface LoginModel {
  EmailID?: string;
  UserID: string;
  PublicKey?: string;
  Password?: string;
  MPin?: number;
  PAN?: string;
  DOB?: Date;
  IsAlreadyLoggedIn: Boolean;
  IsMPINAvailable: Boolean;
  TwoFactor?: TwoFactorModel;
}

/**
 * TwoFactorModel is handle 2fa in login service.
 */
interface TwoFactorModel {
  sIndex?: String;
  sCount: String;
  sQuestions?: String;
  splittedSQuestion?: String[];
  /* Y || N */
  IsPasswordReset?: String;
}

export { LoginModel, TwoFactorModel };

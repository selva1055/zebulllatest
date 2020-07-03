import { SecurityQuestionModel } from "./SecurityQuestion";

interface LoginModel {
  EmailID?: string;
  UserID?: string;
  PublicKey?: string;
  Password?: string;
  MPin?: number;
  PAN?: string;
  DOB?: Date;
  SecurityQuestionArray?: SecurityQuestionModel[];
  IsAlreadyLoggedIn: false;
}

export { LoginModel };

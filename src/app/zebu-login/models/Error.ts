const ErrorConstant: any = {
  BLOCKED_USER: "User Blocked Contact System Administrator",
  STANDARD_ERROR: "Check internet connection. And if you're still facing any issue, please contact our customer care.",
  INVALID_USER_ID: "Submit valid user ID!",
  INVALID_CREDENTIALS: "Submit valid credentials!",
  MIS_MATCHING_CREDENTIALS: "Mis-matching credentials!.",
};

interface ErrorModel {
  IsError: boolean;
  ErrorMsg?: string;
};

export { ErrorConstant, ErrorModel };

const ErrorConstant: any = {
  BLOCKED_USER: "User Blocked Contact System Administrator",
  INTERNAL_ERROR: "Error in the system. Sorry for the trouble. Please call customer care to solve your issue.",
  INVALID_USER_ID: "Submit valid UserID!",
  INVALID_USER_ID_OR_PASSWORD: "Invalid UserID/Password!",
  MIS_MATCHED_CREDENTIALS: "Email address/Password is wrong.",
};

interface ErrorModel {
  IsError: boolean;
  ErrorMsg?: string;
};

export { ErrorConstant, ErrorModel };

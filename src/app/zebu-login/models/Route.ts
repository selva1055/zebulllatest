const ROUTEs = {
  LOGIN: {
    path: "login",
    id: "default",
  },
  /* Identifier is default path, so it comes with login as prefix */
  IDENTIFIER: {
    path: "",
    id: "identifier",
  },
  PASSWORD: {
    path: "login/password",
    id: "password",
  },
  CHALLENGE: {
    path: "login/challenge",
    id: "challenge",
  },
  CONFIRM_M_PIN: {
    path: "login/confirm-mpin",
    id: "confirmMPin",
  },
  M_PIN: {
    path: "login/mpin",
    id: "mpin",
  },
  PASSWORD_FORGOT: {
    path: "login/password/forgot",
    id: "passwordForgot",
  },
  PASSWORD_RESET: {
    path: "login/password/reset",
    id: "passwordReset",
  },
  UNBLOCK: {
    path: "login/unblock",
    id: "unblock",
  },
};

export { ROUTEs };

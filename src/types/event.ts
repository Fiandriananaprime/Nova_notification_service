export type AuthCodeRequestedEvent = {
  type: "auth.code.requested";

  payload: {
    event: "auth.code.requested";
    userId: string;
    target: string;
    channel?: "email" | "phone";
    purpose?: "email_verification" | "phone_verification";
    code: string;
    expiresAt: string;
  };
};

export type NotificationEvent = 
| AuthCodeRequestedEvent ;
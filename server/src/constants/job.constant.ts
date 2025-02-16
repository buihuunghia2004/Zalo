export enum QueueName {
  EMAIL = 'email',
  SOCKET = 'socket'
}

export enum QueuePrefix {
  AUTH = 'auth',
  SOCKET = 'socket'
}

export enum JobName {
  EMAIL_VERIFICATION = 'email-verification',
  EMAIL_SEND_PASSWORD = 'email-send-password',
  EMAIL_SEND_OTP_FORGOT_PASSWORD = 'email-send-otp-forgot-password',
}

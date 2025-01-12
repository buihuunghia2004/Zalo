

export interface loginGoogleRequest {
    idToken: string
}
export interface loginGoogleResponse {
    userId: string
    accessToken: string
    refreshToken: string
    tokenExpires: number
}




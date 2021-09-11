
export interface JWTPayload {
    user_id: string;
    username: string;
    email: string;
    exp: number;
}
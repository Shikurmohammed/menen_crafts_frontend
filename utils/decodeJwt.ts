import { JwtPayload } from "@/types/jwt";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string): JwtPayload => {
    return jwtDecode<JwtPayload>(token);
};
import JWT from "jsonwebtoken";
import { JSON_SECRET_KEY } from "../keys";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, JSON_SECRET_KEY) as {
      userId: number;
    };
  } catch (error) {
    // console.log(error);
    return null;
  }
};

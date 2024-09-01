import token from "jsonwebtoken";
import { formatJSONResponse } from "../utills/ApiGateway.js";

const secret = process.env.SECRETKEY;

export const authorize = async (event) => {
  try {
    
    const authorizationHeader =
      event.headers.Authorization || event.headers.authorization;
    if (!authorizationHeader) {
        return false;
    }

    const tokens = authorizationHeader.split(" ")[1];
    const decodedToken = token.verify(tokens, secret);
    const id = decodedToken.id;

    return true;
  } catch (error) {
    return formatJSONResponse(400, { data: "Unauthorized" });
  }
};

import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./constants";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

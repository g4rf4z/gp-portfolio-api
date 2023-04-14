import config from "config";
import bcrypt from "bcrypt";

// Hashe a given string using bcrypt and a specified salt work factor from configuration.
export const hashString = async (data: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = bcrypt.hashSync(data, salt);
    return hash;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Compare a given data string with a previously hashed version using bcrypt.
export const compareData = async function (
  cryptedData: string,
  data: string
): Promise<boolean> {
  return bcrypt.compare(data, cryptedData).catch((error) => false);
};

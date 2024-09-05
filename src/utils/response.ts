import { ResponseT } from "../types";

export const response = <T>({
  data,
  success,
  error,
  message,
  status,
}: ResponseT<T>) => {
  return {
    success,
    error,
    message,
    status,
    data,
  };
};

export default response;

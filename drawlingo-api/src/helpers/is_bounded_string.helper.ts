import { isString } from "@/helpers/is_string.helper";

export const isBoundedString = (v: unknown, min: number, max: number): v is string =>
  isString(v) && v.trim().length >= min && v.length <= max;

import { ComponentInput, KeyedComponentInput } from "../@types";

export const key = (
  key: string | number, 
  input: ComponentInput,
): KeyedComponentInput => ({ key, input })

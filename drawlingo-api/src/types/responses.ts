export interface DefaultResponse {
  code: string;
  message: string;
}

export interface ResponseWithData<T> extends DefaultResponse {
  data: T;
}

export type ResponseDirect<T> = T;

export type AckResponse<T> =
  | ({ ok: true } & ResponseWithData<T>)
  | ({ ok: false } & DefaultResponse);

export type Ack<T> = (response: AckResponse<T>) => void;

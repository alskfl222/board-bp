import { FormEvent } from 'react';
import axios from 'axios';

export function createFormData(data: Record<string, any>) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string') {
      formData.append(key, data[key]);
    }
    // if (data[key] instanceof File) {
    //   formData.append(key, data[key], data[key].name);
    // }
  });
  return formData;
}

export const submitForm =
  (
    pathname: string,
    data: Record<string, any>,
    options?: { redirect?: string; method?: string }
  ) =>
  async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = createFormData(data);
    const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`;
    const response = await axios({
      url: fetchUrl,
      method: options?.method || 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status >= 400) {
      return;
    }
    if (options?.redirect) window.location.href = options?.redirect;
  };

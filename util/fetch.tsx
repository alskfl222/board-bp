import { FormEvent, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { state } from './state';

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

export async function fetchData(
  pathname: string,
  setData: Dispatch<SetStateAction<Record<string, any>>>
) {
  const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`;
  try {
    const response = await axios.get(fetchUrl);
    setData(response.data);
  } catch {
    window.location.href = '/auth/sign-in';
  }
}

export const submitForm =
  (
    pathname: string,
    data: Record<string, any>,
    options?: {
      redirect?: string;
      method?: string;
      setState?: (...args: any[]) => any;
      callback?: (...args: any[]) => any;
    }
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
    if (options?.setState) options.setState();
    if (options?.callback) options.callback();
    if (options?.redirect) window.location.href = options?.redirect;
  };

export const submitLogin = (data: Record<string, any>) =>
  submitForm('/auth/sign-in', data, {
    redirect: 'user',
    setState: () => (state.isLogin = true),
  });

export const submitUpdate = (
  data: Record<string, any>,
  setIsLoading: Dispatch<SetStateAction<any>>
) => {
  return submitForm('/auth/user', data, {
    method: 'put',
    redirect: '/auth',
    callback: () => setIsLoading(false),
  });
};

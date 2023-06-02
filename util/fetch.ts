import { useUserStore } from '@store/user';

export function createFormData(data: Record<string, any>) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'string') {
      formData.append(key, data[key]);
    }
    if (data[key] instanceof FileList) {
      formData.append(key, data[key], data[key].name);
    }
  });
  return formData;
}

export function getFetchUrl(endpoint: string) {
  return `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`;
}

export function exceptionHandler(err: any) {
  if (err.response) {
    if (err.response.data.error === 'No Token') {
      useUserStore.getState().signOut();
      window.location.href = '/auth/sign-in';
    } else console.log(err.response.data);
  } else {
    console.log(err);
  }
}

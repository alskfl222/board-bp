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


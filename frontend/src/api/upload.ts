import api from './axios';

export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post<{ imageUrl: string }>('/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

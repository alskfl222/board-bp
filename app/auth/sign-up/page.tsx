'use client';

import { useState, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

function createFormData(data: Record<string, any>) {
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

export default function SignUp() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = createFormData({ email, password, name, thumbnail });
    const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/${pathname}`;
    const { data } = await axios.post(fetchUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(data);
    return data;
  }

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p>EMAIL: {email}</p>
        <input
          className="text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>PASSWORD: {password.length}</p>
        <input
          type="password"
          className="text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>NAME: {name}</p>
        <input
          className="text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>THUMBNAIL: {thumbnail ? '있음' : '없음'}</p>
        <input
          type="file"
          onChange={(e) =>
            setThumbnail(e.target.files ? e.target.files[0] : null)
          }
        />
        {thumbnail && (
          <Image
            src={URL.createObjectURL(thumbnail)}
            alt="thumbnail preview"
            width={240}
            height={240}
          />
        )}
        <button type="submit">가입</button>
      </form>
    </div>
  );
}

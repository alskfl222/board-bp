'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

export default function UserInfo() {
  const pathname = usePathname();
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchData() {
      const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`;
      const response = await axios.get(fetchUrl);
      setData(response.data);
    }
    fetchData();
  }, [pathname]);

  return (
    <div>
      <div>
        NAME:{' '}
        <input
          value={data.name}
          onChange={(e) => {
            setData((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
          className='text-black'
        />
      </div>
      <div>EMAIL: {data.email}</div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';

export default function NewsGPT() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchBing = async () => {
    try {
      const response = await axios.get(
        'https://api.bing.microsoft.com/v7.0/search',
        {
          params: {
            q: searchTerm,
          },
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_BING_API_KEY,
          },
        }
      );

      setSearchResults(response.data.webPages.value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        className='text-black'
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button onClick={searchBing}>Search</button>
      {searchResults.map((result, index) => (
        <div key={index}>
          <a href={result.url}>{result.name}</a>
          <p>{result.snippet}</p>
        </div>
      ))}
    </div>
  );
}

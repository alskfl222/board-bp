'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import parse from 'node-html-parser';

export default function NewsGPT() {
  const [searchTerm, setSearchTerm] = useState('');
  const [source, setSource] = useState('전체');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchBing = async () => {
    try {
      const response = await axios.get(
        'https://api.bing.microsoft.com/v7.0/search',
        {
          params: {
            q: `${searchTerm} 뉴스${source !== '전체' && ` ${source}`}`,
          },
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_BING_API_KEY,
          },
        }
      );

      setSearchResults(response.data.webPages.value);
      sessionStorage.setItem(
        'search-result',
        JSON.stringify(response.data.webPages.value)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const analyzeNewsContent = async () => {
    const content = await axios.get('https://news.sbs.co.kr/news/endPage.do?news_id=N1007230862');
    console.log(content)
    // const parsed = parse(content)
  }

  useEffect(() => {
    if (sessionStorage.getItem('search-result')) {
      setSearchResults(JSON.parse(sessionStorage.getItem('search-result')!));
    }
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <div>검색어를 입력해주세요</div>
        <div className='flex gap-4'>
          <input
            className='flex-1 text-black'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className='text-black'
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value='전체' selected>
              전체
            </option>
            <option value='연합뉴스'>연합뉴스</option>
            <option value='YTN'>YTN</option>
            <option value='KBS'>KBS</option>
          </select>
          <button onClick={searchBing}>Search</button>
          <button onClick={analyzeNewsContent}>테스트중</button>
        </div>
      </div>
      <div className='p-2 flex flex-col gap-2 border border-cyan-300'>
        {searchResults.map((result, index) => (
          <div key={index} className='p-2 flex flex-col border'>
            <a href={result.url}>{result.name}</a>
            <p>{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

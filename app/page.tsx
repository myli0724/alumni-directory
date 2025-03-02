'use client';

import { useState, useEffect } from 'react';
import { AlumniRecord, SearchParams } from './types';
import { fetchAlumniList, defaultSearchParams } from './services/api';
import SearchForm from './components/SearchForm';
import AlumniCard from './components/AlumniCard';
import Pagination from './components/Pagination';
import Image from 'next/image';

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch alumni list when search parameters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchAlumniList(searchParams);
        
        if (response.code === 0 && response.data) {
          setAlumniList(response.data.records);
          setTotalPages(response.data.pages);
        } else {
          setError(response.msg || '获取数据失败');
          setAlumniList([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('Error fetching alumni list:', err);
        setError('获取数据失败，请稍后再试');
        setAlumniList([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);

  // Handle search form submission
  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      current: page
    }));
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
            <div className="text-blue-600 text-2xl">👨‍🎓</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">广东高州中学校友目录</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">连接过去与未来，寻找您的同窗好友</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 mb-10 animate-slide-up">
          <SearchForm onSearch={handleSearch} initialParams={searchParams} />
        </div>
        
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-blue-600 font-medium">正在加载校友数据...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl text-center shadow-sm animate-fade-in">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">加载失败</span>
            </div>
            <p>{error}</p>
          </div>
        ) : alumniList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center text-gray-600 animate-fade-in">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">未找到符合条件的校友</p>
              <p className="mt-2 text-gray-500">请尝试调整搜索条件</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg shadow-sm inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                共找到 <span className="font-bold mx-1">{alumniList.length}</span> 位校友
              </div>
              <div className="text-gray-500 text-sm">
                第 <span className="font-medium text-blue-600">{searchParams.current}</span> 页，共 <span className="font-medium text-blue-600">{totalPages}</span> 页
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.map((alumni, index) => (
                <div key={alumni.memberLeadingId} className="transform transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${index * 0.05}s` }}>
                  <AlumniCard alumni={alumni} />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={searchParams.current}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="mt-20 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-2">© {new Date().getFullYear()} 广东高州中学校友会</p>
            <p>联系我们：gzzx_alumni@example.com</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 
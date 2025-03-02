'use client';

import { useState, useEffect } from 'react';
import { AlumniRecord, SearchParams } from './types';
import { fetchAlumniList, defaultSearchParams } from './services/api';
import SearchForm from './components/SearchForm';
import AlumniCard from './components/AlumniCard';
import Pagination from './components/Pagination';

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
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">广东高州中学校友目录</h1>
          <p className="text-gray-600">搜索并浏览校友信息</p>
        </div>
        
        <SearchForm onSearch={handleSearch} initialParams={searchParams} />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        ) : alumniList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            未找到符合条件的校友
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              共找到 {alumniList.length} 位校友 (第 {searchParams.current} 页，共 {totalPages} 页)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.map((alumni) => (
                <AlumniCard key={alumni.memberLeadingId} alumni={alumni} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={searchParams.current}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
} 
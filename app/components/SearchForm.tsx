'use client';

import { useState, useEffect } from 'react';
import { SearchParams } from '../types';
import { generateGraduationYears } from '../services/api';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  initialParams: SearchParams;
}

export default function SearchForm({ onSearch, initialParams }: SearchFormProps) {
  const [keyword, setKeyword] = useState(initialParams.keyword);
  const [selectedYears, setSelectedYears] = useState<number[]>(initialParams.levelId);
  const [graduationYears, setGraduationYears] = useState(generateGraduationYears());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const handleSearch = () => {
    const params: SearchParams = {
      ...initialParams,
      keyword,
      levelId: selectedYears,
      current: 1, // Reset to first page on new search
    };
    onSearch(params);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleYearSelection = (yearId: number) => {
    setSelectedYears(prev => {
      if (prev.includes(yearId)) {
        return prev.filter(id => id !== yearId);
      } else {
        return [...prev, yearId];
      }
    });
  };

  const getSelectedYearsText = () => {
    if (selectedYears.length === 0) return '选择届别';
    
    return selectedYears.map(yearId => {
      const year = graduationYears.find(y => y.id === yearId);
      return year ? year.year : '';
    }).join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">校友搜索</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索校友姓名..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setKeyword('')}
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${!keyword && 'hidden'}`}
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="relative min-w-[200px]">
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
          >
            <span className="truncate">{getSelectedYearsText()}</span>
            <span className="ml-2">{isYearDropdownOpen ? '▲' : '▼'}</span>
          </button>
          
          {isYearDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                {graduationYears.slice(0, 20).map((year) => (
                  <div key={year.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`year-${year.id}`}
                      checked={selectedYears.includes(year.id)}
                      onChange={() => toggleYearSelection(year.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`year-${year.id}`} className="cursor-pointer">{year.year}</label>
                  </div>
                ))}
                {graduationYears.length > 20 && (
                  <div className="p-2 text-center text-gray-500">
                    显示前20个届别...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          搜索
        </button>
      </div>
    </div>
  );
} 
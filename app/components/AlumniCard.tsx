'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AlumniRecord, AlumniDetails } from '../types';
import { fetchAlumniDetails } from '../services/api';
import { createPortal } from 'react-dom';

interface AlumniCardProps {
  alumni: AlumniRecord;
}

export default function AlumniCard({ alumni }: AlumniCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState<AlumniDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleViewDetails = async () => {
    setIsModalOpen(true);
    
    if (!details) {
      setIsLoading(true);
      try {
        const response = await fetchAlumniDetails(alumni.memberLeadingId);
        setDetails(response.data);
      } catch (error) {
        console.error('Error fetching alumni details:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format distance to be more readable
  const formatDistance = (distance: string | null) => {
    if (!distance) return '未知距离';
    
    const distanceNum = parseFloat(distance);
    if (distanceNum < 1000) {
      return `${distanceNum.toFixed(0)}米`;
    } else {
      return `${(distanceNum / 1000).toFixed(1)}公里`;
    }
  };

  // Extract location from companyAddressStr
  const getLocation = (addressStr: string) => {
    if (!addressStr || addressStr === ',,,') return '未知地点';
    
    const parts = addressStr.split(',');
    if (parts.length >= 4) {
      return parts[3] || parts[2] || '未知地点';
    }
    
    return '未知地点';
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个复制成功的提示
      alert('复制成功');
    });
  };

  const Modal = () => {
    if (!mounted) return null;

    return createPortal(
      <div className="modal-overlay animate-fade-in" onClick={() => setIsModalOpen(false)}>
        <div 
          className="modal-content animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-blue-600 font-medium">加载详细信息中...</p>
            </div>
          ) : details ? (
            <>
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-sm rounded-t-2xl"></div>
                <div className="relative pt-6 px-6 pb-0">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="glass-button rounded-full p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col items-center mt-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden glass-effect">
                      {details.avatar ? (
                        <Image 
                          src={details.avatar} 
                          alt={details.name} 
                          fill
                          className="object-cover"
                        />
                      ) : alumni.leadingAvatar ? (
                        <Image 
                          src={alumni.leadingAvatar} 
                          alt={alumni.leadingName} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100/50 to-indigo-100/50 backdrop-blur-sm text-blue-500">
                          <span className="text-4xl">👤</span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">{details.name}</h2>
                    <div className="flex items-center mt-1 mb-2">
                      <span className="badge badge-blue mr-2">{alumni.levelName}</span>
                      {details.socialPosition && (
                        <span className="text-sm text-white/90">{details.socialPosition}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">联系方式</h3>
                <div className="space-y-4">
                  {details.phone && (
                    <div className="flex items-start glass-card p-4">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50/50 text-blue-600 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-700">手机号码</p>
                        <p className="text-gray-600">{details.phone}</p>
                        <button 
                          onClick={() => handleCopy(details.phone || '')}
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          复制
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {details.email && (
                    <div className="flex items-start glass-card p-4">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50/50 text-indigo-600 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-700">电子邮箱</p>
                        <p className="text-gray-600">{details.email}</p>
                        <button 
                          onClick={() => handleCopy(details.email || '')}
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          复制
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {details.wechatId && (
                    <div className="flex items-start glass-card p-4">
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50/50 text-green-600 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-700">微信号</p>
                        <p className="text-gray-600">{details.wechatId}</p>
                        <button 
                          onClick={() => handleCopy(details.wechatId || '')}
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          复制
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {(details.companyName || details.companyTel || details.companyAddress) && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">工作信息</h3>
                    <div className="space-y-4">
                      {details.companyName && (
                        <div className="flex items-start glass-card p-4">
                          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-50/50 text-purple-600 mr-4 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </span>
                          <div>
                            <p className="font-medium text-gray-700">公司</p>
                            <p className="text-gray-600">{details.companyName}</p>
                            {details.companyPositionName && (
                              <p className="text-gray-600 text-sm mt-1">职位: {details.companyPositionName}</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {details.companyTel && (
                        <div className="flex items-start glass-card p-4">
                          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-50/50 text-yellow-600 mr-4 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </span>
                          <div>
                            <p className="font-medium text-gray-700">公司电话</p>
                            <p className="text-gray-600">{details.companyTel}</p>
                            <button 
                              onClick={() => handleCopy(details.companyTel || '')}
                              className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              复制
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {details.companyAddress && (
                        <div className="flex items-start glass-card p-4">
                          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50/50 text-red-600 mr-4 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </span>
                          <div>
                            <p className="font-medium text-gray-700">公司地址</p>
                            <p className="text-gray-600">{details.companyAddress}</p>
                            <button 
                              onClick={() => handleCopy(details.companyAddress || '')}
                              className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              复制
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {details.briefIntroduction && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4 border-b pb-2">个人简介</h3>
                    <div className="glass-card p-4">
                      <p className="text-gray-600 whitespace-pre-line">{details.briefIntroduction}</p>
                    </div>
                  </>
                )}
                
                <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="glass-button px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-2">无法加载详细信息</p>
              <p className="text-gray-500 mb-6">请稍后再试或联系管理员</p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="glass-button px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900"
              >
                关闭
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className="card cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 mr-4 flex-shrink-0 border-2 border-white shadow-md">
              {alumni.leadingAvatar ? (
                <Image 
                  src={alumni.leadingAvatar} 
                  alt={alumni.leadingName} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-500">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{alumni.leadingName}</h3>
              <div className="flex items-center mt-1">
                <span className="badge badge-blue mr-2">{alumni.levelName}</span>
                {alumni.leadingSocialPosition && (
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">{alumni.leadingSocialPosition}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2 mt-3">
            <p className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="truncate">{getLocation(alumni.companyAddressStr)}</span>
            </p>
            {alumni.currentDistance && (
              <p className="flex items-center">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-50 text-green-600 mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </span>
                <span>{formatDistance(alumni.currentDistance)}</span>
              </p>
            )}
            <p className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span>加入时间: {alumni.joinTime}</span>
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 text-right border-t border-gray-100">
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors duration-200 flex items-center justify-end">
            查看详情
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {isModalOpen && <Modal />}
    </>
  );
} 
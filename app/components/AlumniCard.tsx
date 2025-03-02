'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlumniRecord, AlumniDetails } from '../types';
import { fetchAlumniDetails } from '../services/api';

interface AlumniCardProps {
  alumni: AlumniRecord;
}

export default function AlumniCard({ alumni }: AlumniCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState<AlumniDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
              {alumni.leadingAvatar ? (
                <Image 
                  src={alumni.leadingAvatar} 
                  alt={alumni.leadingName} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{alumni.leadingName}</h3>
              <p className="text-sm text-gray-600">{alumni.levelName}</p>
              {alumni.leadingSocialPosition && (
                <p className="text-sm text-gray-600">{alumni.leadingSocialPosition}</p>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-1 flex items-center">
              <span className="mr-2">📍</span>
              <span>{getLocation(alumni.companyAddressStr)}</span>
            </p>
            {alumni.currentDistance && (
              <p className="mb-1 flex items-center">
                <span className="mr-2">🧭</span>
                <span>{formatDistance(alumni.currentDistance)}</span>
              </p>
            )}
            <p className="mb-1 flex items-center">
              <span className="mr-2">🗓️</span>
              <span>加入时间: {alumni.joinTime}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal for displaying alumni details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">校友详情</h2>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : details ? (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
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
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-3xl">👤</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{details.name}</h3>
                      <p className="text-sm text-gray-600">{alumni.levelName}</p>
                      {details.socialPosition && (
                        <p className="text-sm text-gray-600">{details.socialPosition}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {details.phone && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">📱</span>
                        <div>
                          <p className="font-medium text-gray-700">手机号码</p>
                          <p className="text-gray-600">{details.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {details.email && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">✉️</span>
                        <div>
                          <p className="font-medium text-gray-700">电子邮箱</p>
                          <p className="text-gray-600">{details.email}</p>
                        </div>
                      </div>
                    )}
                    
                    {details.wechatId && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">💬</span>
                        <div>
                          <p className="font-medium text-gray-700">微信号</p>
                          <p className="text-gray-600">{details.wechatId}</p>
                        </div>
                      </div>
                    )}
                    
                    {details.companyName && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">🏢</span>
                        <div>
                          <p className="font-medium text-gray-700">公司</p>
                          <p className="text-gray-600">{details.companyName}</p>
                          {details.companyPositionName && (
                            <p className="text-gray-600 text-sm">{details.companyPositionName}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {details.companyTel && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">☎️</span>
                        <div>
                          <p className="font-medium text-gray-700">公司电话</p>
                          <p className="text-gray-600">{details.companyTel}</p>
                        </div>
                      </div>
                    )}
                    
                    {details.companyAddress && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">🏙️</span>
                        <div>
                          <p className="font-medium text-gray-700">公司地址</p>
                          <p className="text-gray-600">{details.companyAddress}</p>
                        </div>
                      </div>
                    )}
                    
                    {details.briefIntroduction && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-3">📝</span>
                        <div>
                          <p className="font-medium text-gray-700">简介</p>
                          <p className="text-gray-600">{details.briefIntroduction}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-4">无法加载详细信息</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
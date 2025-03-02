import { AlumniDetailsResponse, AlumniListResponse, GraduationYear, SearchParams } from '../types';

// Default search parameters
export const defaultSearchParams: SearchParams = {
  current: 1,
  size: 10,
  mapType: 0,
  keyword: '',
  assType: 1,
  contactsType: 1,
  typeId: [],
  levelId: [],
  industryId: [],
  areaId: [],
  currentLatitude: 21.918119430541992,
  currentLongitude: 110.85337829589844
};

// Fetch alumni list
export async function fetchAlumniList(params: SearchParams): Promise<AlumniListResponse> {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/app/member-contacts/page',
        data: params,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching alumni list:', error);
    throw error;
  }
}

// Fetch alumni details
export async function fetchAlumniDetails(memberLeadingId: number): Promise<AlumniDetailsResponse> {
  try {
    const response = await fetch(`/api/proxy?endpoint=/app/org/businessCard/personal/${memberLeadingId}?isOneSelfShare=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching alumni details:', error);
    throw error;
  }
}

// Generate graduation years from 1949 to current year
export function generateGraduationYears(): GraduationYear[] {
  const currentYear = new Date().getFullYear();
  const years: GraduationYear[] = [];
  
  // Starting from 2024 (id: 182) and going backwards
  let id = 182;
  for (let year = 2024; year >= 1949; year--) {
    years.push({ id, year: `${year}届` });
    id--;
  }
  
  return years;
} 
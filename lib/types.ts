export interface Festival {
  id: string;
  name: string;
  date: string;
  region_tags: string[];
  description: string;
  foods: FestivalFood[];
}

export interface FestivalFood {
  name: string;
  short_note: string;
}

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  image?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export type ComplaintCategory = 'Water' | 'Electricity' | 'Sanitation' | 'Road' | 'Garbage';
export type ComplaintStatus = 'Submitted' | 'In Review' | 'Resolved';

export interface Reminder {
  id: string;
  festivalId: string;
  festivalName: string;
  festivalDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  type: 'civic' | 'festival';
  date: string;
  isActive: boolean;
}

export interface StorageData {
  complaints: Complaint[];
  reminders: Reminder[];
  notices: Notice[];
  version: number;
}
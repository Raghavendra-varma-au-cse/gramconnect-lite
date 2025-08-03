import { Complaint, Reminder, Notice, StorageData, ComplaintStatus } from './types';

const STORAGE_KEY = 'gramconnect_data';
const CURRENT_VERSION = 1;

const defaultData: StorageData = {
  complaints: [
    {
      id: 'complaint-1',
      category: 'Water',
      description: 'Water supply has been irregular for the past week in our locality. We are getting water only for 2 hours in the morning.',
      location: 'Sector 12, Dwarka, New Delhi',
      status: 'In Review',
      createdAt: '2025-01-10T10:30:00Z',
      updatedAt: '2025-01-12T14:20:00Z'
    },
    {
      id: 'complaint-2',
      category: 'Road',
      description: 'Large pothole on the main road causing traffic issues and accidents. Urgent repair needed.',
      location: 'MG Road, Bangalore',
      status: 'Submitted',
      createdAt: '2025-01-11T16:45:00Z',
      updatedAt: '2025-01-11T16:45:00Z'
    },
    {
      id: 'complaint-3',
      category: 'Garbage',
      description: 'Garbage collection has been missed for 3 days. Waste is piling up and creating hygiene issues.',
      location: 'Andheri West, Mumbai',
      status: 'Resolved',
      createdAt: '2025-01-08T09:15:00Z',
      updatedAt: '2025-01-13T11:30:00Z'
    }
  ],
  reminders: [],
  notices: [
    {
      id: 'notice-1',
      title: 'Festival Safety Guidelines',
      message: 'Please follow safety protocols during festival celebrations. Avoid crowded places and maintain social distancing.',
      type: 'festival',
      date: '2025-01-15',
      isActive: true
    }
  ],
  version: CURRENT_VERSION
};

export class LocalStorage {
  private static getData(): StorageData {
    if (typeof window === 'undefined') return defaultData;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.setData(defaultData);
        return defaultData;
      }
      
      const data = JSON.parse(stored) as StorageData;
      
      // Version migration logic
      if (data.version !== CURRENT_VERSION) {
        const migratedData = this.migrateData(data);
        this.setData(migratedData);
        return migratedData;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultData;
    }
  }

  private static setData(data: StorageData): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  private static migrateData(data: any): StorageData {
    // Handle version migrations here
    return {
      ...defaultData,
      ...data,
      version: CURRENT_VERSION
    };
  }

  // Complaints
  static getComplaints(): Complaint[] {
    return this.getData().complaints;
  }

  static addComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>): Complaint {
    const data = this.getData();
    const newComplaint: Complaint = {
      ...complaint,
      id: `complaint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.complaints.unshift(newComplaint);
    this.setData(data);
    return newComplaint;
  }

  static updateComplaintStatus(id: string, status: ComplaintStatus): void {
    const data = this.getData();
    const complaint = data.complaints.find(c => c.id === id);
    if (complaint) {
      complaint.status = status;
      complaint.updatedAt = new Date().toISOString();
      this.setData(data);
    }
  }

  // Reminders
  static getReminders(): Reminder[] {
    return this.getData().reminders;
  }

  static addReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Reminder {
    const data = this.getData();
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    data.reminders.push(newReminder);
    this.setData(data);
    return newReminder;
  }

  static removeReminder(festivalId: string): void {
    const data = this.getData();
    data.reminders = data.reminders.filter(r => r.festivalId !== festivalId);
    this.setData(data);
  }

  static toggleReminder(festivalId: string, festivalName: string, festivalDate: string): boolean {
    const data = this.getData();
    const existingReminder = data.reminders.find(r => r.festivalId === festivalId);
    
    if (existingReminder) {
      data.reminders = data.reminders.filter(r => r.festivalId !== festivalId);
      this.setData(data);
      return false;
    } else {
      this.addReminder({
        festivalId,
        festivalName,
        festivalDate,
        isActive: true
      });
      return true;
    }
  }

  // Notices
  static getNotices(): Notice[] {
    return this.getData().notices;
  }

  static addNotice(notice: Omit<Notice, 'id'>): Notice {
    const data = this.getData();
    const newNotice: Notice = {
      ...notice,
      id: `notice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    data.notices.push(newNotice);
    this.setData(data);
    return newNotice;
  }

  static updateNotice(id: string, updates: Partial<Notice>): void {
    const data = this.getData();
    const notice = data.notices.find(n => n.id === id);
    if (notice) {
      Object.assign(notice, updates);
      this.setData(data);
    }
  }

  static deleteNotice(id: string): void {
    const data = this.getData();
    data.notices = data.notices.filter(n => n.id !== id);
    this.setData(data);
  }
}
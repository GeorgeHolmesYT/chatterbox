import Dexie from 'dexie';

// Define the database schema
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageId?: string;
  lastMessageTimestamp?: Date;
  unreadCount: number;
  name?: string;
  isGroup: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'friend_request' | 'system';
  content: string;
  timestamp: Date;
  read: boolean;
  relatedId?: string;
}

export interface Settings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  sounds: boolean;
  language: string;
}

class ChatterBoxDatabase extends Dexie {
  users!: Dexie.Table<User, string>;
  messages!: Dexie.Table<Message, string>;
  conversations!: Dexie.Table<Conversation, string>;
  notifications!: Dexie.Table<Notification, string>;
  settings!: Dexie.Table<Settings, string>;

  constructor() {
    super('ChatterBoxDB');
    
    this.version(1).stores({
      users: 'id, username, email',
      messages: 'id, senderId, receiverId, timestamp, read',
      conversations: 'id, *participantIds, lastMessageTimestamp, unreadCount',
      notifications: 'id, userId, type, timestamp, read',
      settings: 'id, userId'
    });
  }
}

export const db = new ChatterBoxDatabase();

// Helper functions for database operations
export async function getCurrentUserSettings(userId: string): Promise<Settings> {
  let settings = await db.settings.where({ userId }).first();
  
  if (!settings) {
    // Create default settings if none exist
    settings = {
      id: `settings-${userId}`,
      userId,
      theme: 'dark',
      notifications: true,
      sounds: true,
      language: 'en'
    };
    
    await db.settings.add(settings);
  }
  
  return settings;
}

export async function updateUserSettings(userId: string, updates: Partial<Settings>): Promise<Settings> {
  const settings = await getCurrentUserSettings(userId);
  const updatedSettings = { ...settings, ...updates };
  
  await db.settings.put(updatedSettings);
  return updatedSettings;
}

export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  return await db.notifications
    .where({ userId, read: false })
    .count();
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await db.notifications
    .where({ userId, read: false })
    .modify({ read: true });
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  return await db.conversations
    .where('participantIds').equals(userId)
    .reverse()
    .sortBy('lastMessageTimestamp');
}

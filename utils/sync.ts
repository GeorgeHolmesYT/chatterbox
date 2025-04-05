import { supabase } from './supabaseClient';
import { db, User, Message, Conversation, Notification } from '../db/dexie';

/**
 * Sync local database with remote Supabase data
 * @param userId The current user's ID
 */
export async function syncData(userId: string): Promise<void> {
  try {
    // Get the last sync timestamp from localStorage
    const lastSync = localStorage.getItem('lastSyncTimestamp');
    const lastSyncTimestamp = lastSync ? new Date(lastSync) : new Date(0);
    
    // Update the sync timestamp
    localStorage.setItem('lastSyncTimestamp', new Date().toISOString());
    
    // Sync users
    await syncUsers(userId, lastSyncTimestamp);
    
    // Sync messages
    await syncMessages(userId, lastSyncTimestamp);
    
    // Sync conversations
    await syncConversations(userId, lastSyncTimestamp);
    
    // Sync notifications
    await syncNotifications(userId, lastSyncTimestamp);
    
    console.log('Data sync completed successfully');
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
}

/**
 * Sync users data
 */
async function syncUsers(userId: string, lastSyncTimestamp: Date): Promise<void> {
  // Get users from Supabase that the current user has conversations with
  const { data: userConversations, error: conversationsError } = await supabase
    .from('conversations')
    .select('participant_ids')
    .contains('participant_ids', [userId]);
    
  if (conversationsError) {
    console.error('Error fetching conversations for user sync:', conversationsError);
    return;
  }
  
  // Extract all unique user IDs from conversations
  const userIds = new Set<string>();
  userConversations?.forEach(conv => {
    conv.participant_ids.forEach((id: string) => {
      if (id !== userId) {
        userIds.add(id);
      }
    });
  });
  
  // Add the current user ID
  userIds.add(userId);
  
  // Fetch user data from Supabase
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, username, email, avatar_url, last_seen')
    .in('id', Array.from(userIds));
    
  if (usersError) {
    console.error('Error fetching users for sync:', usersError);
    return;
  }
  
  // Update local database
  if (users && users.length > 0) {
    const formattedUsers: User[] = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatar_url,
      lastSeen: user.last_seen ? new Date(user.last_seen) : undefined
    }));
    
    await db.users.bulkPut(formattedUsers);
  }
}

/**
 * Sync messages data
 */
async function syncMessages(userId: string, lastSyncTimestamp: Date): Promise<void> {
  // Get new messages from Supabase
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .gt('created_at', lastSyncTimestamp.toISOString());
    
  if (messagesError) {
    console.error('Error fetching messages for sync:', messagesError);
    return;
  }
  
  // Update local database
  if (messages && messages.length > 0) {
    const formattedMessages: Message[] = messages.map(msg => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      read: msg.read,
      attachments: msg.attachments
    }));
    
    await db.messages.bulkPut(formattedMessages);
  }
}

/**
 * Sync conversations data
 */
async function syncConversations(userId: string, lastSyncTimestamp: Date): Promise<void> {
  // Get conversations from Supabase
  const { data: conversations, error: conversationsError } = await supabase
    .from('conversations')
    .select('*')
    .contains('participant_ids', [userId])
    .gt('updated_at', lastSyncTimestamp.toISOString());
    
  if (conversationsError) {
    console.error('Error fetching conversations for sync:', conversationsError);
    return;
  }
  
  // Update local database
  if (conversations && conversations.length > 0) {
    const formattedConversations: Conversation[] = conversations.map(conv => ({
      id: conv.id,
      participantIds: conv.participant_ids,
      lastMessageId: conv.last_message_id,
      lastMessageTimestamp: conv.last_message_timestamp ? new Date(conv.last_message_timestamp) : undefined,
      unreadCount: conv.unread_count || 0,
      name: conv.name,
      isGroup: conv.is_group
    }));
    
    await db.conversations.bulkPut(formattedConversations);
  }
}

/**
 * Sync notifications data
 */
async function syncNotifications(userId: string, lastSyncTimestamp: Date): Promise<void> {
  // Get notifications from Supabase
  const { data: notifications, error: notificationsError } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .gt('created_at', lastSyncTimestamp.toISOString());
    
  if (notificationsError) {
    console.error('Error fetching notifications for sync:', notificationsError);
    return;
  }
  
  // Update local database
  if (notifications && notifications.length > 0) {
    const formattedNotifications: Notification[] = notifications.map(notif => ({
      id: notif.id,
      userId: notif.user_id,
      type: notif.type,
      content: notif.content,
      timestamp: new Date(notif.created_at),
      read: notif.read,
      relatedId: notif.related_id
    }));
    
    await db.notifications.bulkPut(formattedNotifications);
  }
}

/**
 * Push local changes to Supabase
 */
export async function pushLocalChanges(): Promise<void> {
  // Implementation for pushing local changes to the server
  // This would handle offline-first functionality
  // Not fully implemented in this example
}

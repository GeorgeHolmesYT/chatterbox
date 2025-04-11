from supabase import create_client
from .config import Config

supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

class User:
    @staticmethod
    def get_by_id(user_id):
        return supabase.table('users').select('*').eq('id', user_id).execute()
    
    @staticmethod
    def create(user_data):
        return supabase.table('users').insert(user_data).execute()

class Message:
    @staticmethod
    def get_by_channel(channel_id, limit=50):
        return supabase.table('messages').select('*').eq('channel_id', channel_id).order('created_at', desc=True).limit(limit).execute()
    
    @staticmethod
    def create(message_data):
        return supabase.table('messages').insert(message_data).execute()

class Channel:
    @staticmethod
    def get_all():
        return supabase.table('channels').select('*').execute()
    
    @staticmethod
    def get_by_id(channel_id):
        return supabase.table('channels').select('*').eq('id', channel_id).execute()
    
    @staticmethod
    def create(channel_data):
        return supabase.table('channels').insert(channel_data).execute()

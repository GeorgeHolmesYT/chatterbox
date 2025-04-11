import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('JWT_SECRET', 'default-secret-key')
    SUPABASE_URL = os.environ.get('SUPABASE_PROJECT_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_ANON')
    SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE')

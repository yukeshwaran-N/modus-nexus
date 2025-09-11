# supabase_client.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")  # You'll need to get this from Supabase dashboard

supabase: Client = create_client(url, key)

def get_criminal_records():
    try:
        response = supabase.table("criminal_records").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching criminal records: {e}")
        return []

def add_criminal_record(record_data):
    try:
        response = supabase.table("criminal_records").insert(record_data).execute()
        return response.data
    except Exception as e:
        print(f"Error adding criminal record: {e}")
        return None

# Add more functions for update, delete, etc.
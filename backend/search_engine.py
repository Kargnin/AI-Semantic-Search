import pinecone
from dotenv import load_dotenv
import os

load_dotenv()

# connect to pinecone environment
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT") or "asia-southeast1",
)

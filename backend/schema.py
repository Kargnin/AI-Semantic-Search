# Schema for fastAPI model
from pydantic import BaseModel

# Query results
class QueryResults(BaseModel):
    query: str
    results: list
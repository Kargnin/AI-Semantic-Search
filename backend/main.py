import fastapi
from schema import QueryResults
from squad_setup import get_context, extract_answer
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A Search Engine for using fastAPI
@app.get("/", tags=["Search Engine"], response_model=QueryResults)
def query(query: str,mode: str = 'retriever_only',top_k: int = 3):
        
    # Search for the query in dataset
    context = get_context(query, top_k=top_k)

    # Extract answer from the context
    answer = extract_answer(query, context,sort=(mode!='retriever_only'))
    # Return the answer
    return {"query": query, "results": answer}

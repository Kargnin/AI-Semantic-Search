# Setup SQuAD dataset in pinecone with tokenized data

# Use Open AI’s latest text embeddings to vectorize the text documents to be searched from.

import pinecone
from dotenv import load_dotenv
import os
from tqdm import tqdm

# Import AutoModelForQuestionAnswering
from transformers import AutoModelForQuestionAnswering,AutoTokenizer

load_dotenv()

# connect to pinecone environment
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT") or "asia-southeast1",
)

# from datasets import load_dataset

# # load the squad dataset into a pandas dataframe
# df = load_dataset("squad", split="train").to_pandas()
# # select only title and context column
# df = df[["title", "context"]]
# # drop rows containing duplicate context passages
# df = df.drop_duplicates(subset="context")
# df

# Create a pinecone index with the title and context columns as the data to be searched from.
index_name = "extractive-question-answering"

# check if the extractive-question-answering index exists
if index_name not in pinecone.list_indexes():
    # create the index if it does not exist
    pinecone.create_index(
        index_name,
        dimension=384,
        metric="cosine"
    )

# connect to extractive-question-answering index we created
index = pinecone.Index(index_name)

import torch
from sentence_transformers import SentenceTransformer

retriever = None
# set device to GPU if available
device = 'cuda' if torch.cuda.is_available() else 'cpu'
# Check if model is already available locally, otherwise download
if not os.path.exists("./retriever"):
    # load the retriever model from huggingface model hub
    retriever = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1', device=device)
    # Save model to disk
    retriever.save("./retriever")
else:
    # load the retriever model from disk
    retriever = SentenceTransformer('./retriever', device=device)

from tqdm.auto import tqdm

# we will use batches of 64
batch_size = 64

def add_to_index():
    for i in tqdm(range(0, len(df), batch_size)):
        # find end of batch
        i_end = min(i+batch_size, len(df))
        # extract batch
        batch = df.iloc[i:i_end]
        # generate embeddings for batch
        emb = retriever.encode(batch["context"].tolist()).tolist()
        # get metadata
        meta = batch.to_dict(orient="records")
        # create unique IDs
        ids = [f"{idx}" for idx in range(i, i_end)]
        # add all to upsert list
        to_upsert = list(zip(ids, emb, meta))
        # upsert/insert these records to pinecone
        _ = index.upsert(vectors=to_upsert)

# check that we have all vectors in index
index.describe_index_stats()

from transformers import pipeline

model_name = "deepset/electra-base-squad2"
reader = None
# Check if model is already available locally, otherwise download
if not os.path.exists("./reader"):
    # load the reader model into a question-answering pipeline
    reader = pipeline(tokenizer=model_name, model=model_name, task="question-answering", device=device)
    # Save model to disk
    # Save tokenizer and model to disk
    reader.save_pretrained("./reader")
else:
    # Load model from disk ./reader
    tokenizer = AutoTokenizer.from_pretrained("./reader",local_files_only=True)
    model = AutoModelForQuestionAnswering.from_pretrained("./reader",local_files_only=True)
    reader = pipeline(tokenizer="./reader", model="./reader", task="question-answering", device=device)

from pprint import pprint
# gets context passages from the pinecone index
def get_context(question, top_k):
    # generate embeddings for the question
    xq = retriever.encode([question]).tolist()
    # search pinecone index for context passage with the answer
    xc = index.query(xq, top_k=top_k, include_metadata=True)
    # Sort xc matches by score
    xc["matches"] = sorted(xc["matches"], key=lambda x: x["score"], reverse=True)
    # extract the context passage from pinecone search result
    c = [x["metadata"]["context"] for x in xc["matches"]]
    return c



# extracts answer from the context passage
def extract_answer(question, context, sort=False):
    results = []
    for c in context:
        # feed the reader the question and contexts to extract answers
        answer = reader(question=question, context=c)
        # add the context to answer dict for printing both together
        answer["context"] = c
        results.append(answer)
    
    if not sort:
        return results
    # sort the result based on the score from reader model
    sorted_result = sorted(results, key=lambda x: x["score"], reverse=True)
    return sorted_result

# question = "What are the first names of the men that invented youtube?"
# context = get_context(question, top_k=1)
# extract_answer(question, context)

if __name__ =='__main__':
    add_to_index()
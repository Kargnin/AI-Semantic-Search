# AI Semantic Search

The aim of this project is to implement a semantic search using artificial intelligence. You will develop a search engine that encodes the user's query into a vector and searches for similarity within a body of text. The user can store all the text to be searched using a vector database like Pinecone. This search engine will be designed to provide accurate and relevant search results.

## Features

* Vector Database: Used pinecone for faster similarity matching
* Vectorization Algorithm: Used 'multi-qa-MiniLM-L6-cos-v1' pretrained model from hugging face for tokenization
* Similarity Search Algorithm: Cosine similarity is used to rank documents, optimized using a vector database(pinecone)
* User Interface: Has a clean frontend to interact with the dataset
* Dataset: Used SQuAD, although a question answering dataset it very popular and also provides insights into answering capabilities of the model as most of the queries are looking for more than just exact word match
* Used retriever + reader architechture, you can opt to chose only the retriever to rank the final results, also can chose number of results from frontend.

## Setup

Setup guides for both frontend and backend are mentioned in their folders

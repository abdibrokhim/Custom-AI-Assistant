import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import CohereEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import Cohere
from langchain.chains import VectorDBQA
from langchain_community.document_loaders import PyMuPDFLoader
from dotenv import load_dotenv


def generate_prompt(query, file_path):
    
    load_dotenv()

    COHERE_API_KEY=""
                    
    try:

        print('query:', query)
        print('file_path:',file_path)

        loader = PyMuPDFLoader(file_path)
        documents = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        texts = text_splitter.split_documents(documents)

        embeddings = CohereEmbeddings(cohere_api_key=COHERE_API_KEY)
        vectordb = Chroma.from_documents(texts, embeddings)

        qa = VectorDBQA.from_chain_type(llm=Cohere(cohere_api_key=COHERE_API_KEY, truncate="END"), chain_type="stuff", vectorstore=vectordb)

        prompt = qa.run(query)

        if prompt == "":
            return ""
        
        print('prompt:', prompt)
        
        return prompt.strip()

    except Exception as e:
        print(e)
        return ""
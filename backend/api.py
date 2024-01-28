
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn
import chroma_cohere, chroma_chatgpt
from tempfile import NamedTemporaryFile
import os

app = FastAPI()

origins = ['http://localhost:3000/']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

temp_file_path = ''


@app.get("/")
async def read_root():
    return {"message": "Hello World"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global temp_file_path
    try:
        # Save the file to a temporary file
        with NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name

        return {"file_path": temp_file_path}
    except Exception as e:        
        # Cleanup if an error occurs
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chat/cohere/{query}")
def chat_cohere(query: str):
    return chroma_cohere.generate_prompt(query, temp_file_path)


@app.get("/chat/chatgpt/{query}")
def chat_chatgpt(query: str):
    return chroma_chatgpt.generate_prompt(query, temp_file_path)


if __name__ == "__main__":
    uvicorn.run(app, port=8000)




from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn
import chroma_cohere, chroma_chatgpt

app = FastAPI()

origins = ['http://localhost:3000/']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

current_file = "backend/files/sample.pdf"


@app.get("/")
async def read_root():
    return {"message": "Hello World"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print('processing: ', file.filename)
    with open(current_file, 'wb') as f:
        f.write(await file.read())
    print('saved file: ', current_file)
    return FileResponse(current_file, filename='sample.pdf')


@app.get("/chat/cohere/{query}")
def chat_cohere(query: str):
    return chroma_cohere.generate_prompt(query, current_file)


@app.get("/chat/chatgpt/{query}")
def chat_chatgpt(query: str):
    return chroma_chatgpt.generate_prompt(query, current_file)


if __name__ == "__main__":
    uvicorn.run(app, port=8000)



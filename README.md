# Custom ChatGPT PDF Cruncher

## Description

This is a custom implementation of the ChatGPT model from OpenAI. It is a chatbot that can be used to answer questions about a PDF document. The PDF document is uploaded to the server and the server will process the PDF and return a JSON object with the answers to the questions. 

## Powered by
Cohere.ai - https://cohere.ai/
OpenAI - https://openai.com/


## Pre-requisites

Get Cohere API Key from https://cohere.ai/
Get OpenAI API Key from https://beta.openai.com/

Go to `backend` and create file: `.env` and paste your 
Cohere API key in the `COHERE_API_KEY="your-api-key"` field
OpenAI API key in the `OPENAI_API_KEY="your-api-key"` field

Go to `backend` and create new folder `files`


## Installation

### Frontend

```
npm install
```

`**Note**`:
If there is an error, simple remove the package-lock.json file and run the command again.

```
npm install
```

```
npm start
```

### Backend

```
cd backend
```

```
python3 -m venv .venv
```

`**Note**`:
Make sure you are using Python version less than 3.9

```
source .venv/bin/activate
```

```
pip install -r requirements.txt
```

```
python3 api.py
```

## Usage

### Frontend

Go to `localhost:3000` and upload a PDF file. Once the file is uploaded, you can ask questions about the PDF document.

### Backend

Go to `localhost:8000/#docs` and you will see the API documentation. You can test the API from there.


## License
[MIT](https://choosealicense.com/licenses/mit/)


Made with ❤️ by [Ibrohim Abdivokhidov](https://www.linkedin.com/in/abdibrokhim/)


💰 Sponsor PDF Cruncher development: 


✅ Try out the app: https://pdfcruncher.vercel.app/


☕️ Buy me Coffee: https://www.buymeacoffee.com/abdibrokhim

🫶 Support me on Patreon: https://www.patreon.com/abdibrokhim
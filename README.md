Get Cohere API Key from https://cohere.ai/
Go to `backend` > `chroma_cohere.py` and paste the key in the `COHERE_API_KEY="your-api-key"` field

Go to `backend` and create new folder `files`


Frontend

```
npm install
```

If there is an error, simple remove the package-lock.json file and run the command again.

```
npm install
```

```
npm start
```

Backend

```
cd backend
```

```
python3 -m venv venv
```

```
source venv/bin/activate
```

```
pip install -r requirements.txt
```

```
python3 api.py
```
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

# Copy the requirements.txt first to leverage Docker cache
COPY ./api/requirements.txt /index/

# Upgrade pip and install requirements
RUN pip install --upgrade pip && \
    pip install -r /index/requirements.txt

# Copy the rest of the application
COPY ./api /index
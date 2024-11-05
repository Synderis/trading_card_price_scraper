# Use the official Python image as the base image
FROM public.ecr.aws/docker/library/python:3.12-slim

# Install build-essential and other necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the AWS Lambda Web Adapter into the image
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# Set the port environment variable
ENV PORT=8000

# Set the working directory in the container
WORKDIR /var/task

# Copy the requirements file first for better caching
COPY requirements.txt ./

# Install dependencies
RUN python -m pip install --no-cache-dir -r requirements.txt

# Copy your FastAPI application code (ensure main.py is present)
COPY *.py ./

# Command to run the application using Uvicorn with the AWS Lambda Web Adapter
CMD ["uvicorn", "--host", "0.0.0.0", "--port=8000", "main:app"]

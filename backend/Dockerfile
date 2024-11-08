# Use the official Python image as the base image
FROM public.ecr.aws/docker/library/python:3.12-slim

# Install build-essential and other necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the AWS Lambda Web Adapter into the image
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

# Set environment variables
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /var/task

COPY google_info.json /var/task/google_info.json

# Copy the requirements file first for better caching
COPY requirements.txt .

# Update pip and install dependencies
RUN python -m pip install --no-cache-dir --upgrade pip && \
    python -m pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application code (ensure all necessary Python files are present)
COPY main.py card_scraper.py ml_card_img_matcher.py ocr_ml_reader.py ./

# Command to run the application using Uvicorn with the AWS Lambda Web Adapter
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

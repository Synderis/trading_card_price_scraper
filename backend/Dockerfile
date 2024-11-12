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

# Set environment variables
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /var/task

# Copy necessary application files to the container
COPY google_info.json /var/task/google_info.json
COPY trained_ml_models /var/task/trained_ml_models
COPY assets /var/task/assets

# Copy the requirements file first for better caching
COPY requirements.txt ./

# Update pip and install dependencies
RUN python -m pip install --no-cache-dir --upgrade pip && \
    python -m pip install --no-cache-dir -r requirements.txt

# Calculate and save the size of installed packages
RUN du -sh /usr/local/lib/python3.12/site-packages > /var/task/package_sizes.txt

# Copy the FastAPI application code (ensure all necessary Python files are present)
COPY *.py /var/task/

# Command to run the application using Uvicorn with the AWS Lambda Web Adapter
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

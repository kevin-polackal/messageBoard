# Working from Python version 3.9
FROM python:3.9-alpine

# Install system dependencies
RUN apk add --no-cache gcc musl-dev python3-dev libffi-dev openssl-dev

# setting the working directory inside the container to /usr/src/app
WORKDIR /usr/src/app

# copying the requirements.txt file from the host system to inside the container
COPY requirements.txt .

# install requirements inside the container using pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory contents into the container at /usr/src/app
COPY . .

# expose port 5000 from the container (to align with your Flask app's port)
EXPOSE 4000

# tell the container to run the flask application
CMD ["python", "app.py"]

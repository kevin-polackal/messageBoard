
FROM python:3.9-alpine


RUN apk add --no-cache gcc musl-dev python3-dev libffi-dev openssl-dev


WORKDIR /usr/src/app


COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt


COPY . .


EXPOSE 4000


CMD ["python", "app.py"]

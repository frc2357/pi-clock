FROM balenalib/raspberrypi3-python:3-bookworm-run

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . ./

CMD ["python", "-u", "src/app.py"]
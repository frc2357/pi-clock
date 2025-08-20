# I can't get docker working atm because "No module found: mesonpy"

FROM balenalib/raspberrypi3-python:3.9-bookworm-run

# RUN install_packages build-essential python3-dev python3-pip libc-dev
RUN apt update && apt install -y --no-install-recommends \
    build-essential \
    bzip2 \
    tzdata \
    python3-dev \
    python3-pip \
    python3-sysv-ipc \
    python3-numpy \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

#RUN pip install --use-pep517 --no-build-isolation meson-python ninja pybind11 Cython
RUN pip install --use-pep517 --no-build-isolation -r requirements.txt

COPY . ./

CMD ["python", "-u", "src/app.py"]
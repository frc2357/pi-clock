FROM balenalib/raspberrypi3-python:3-stretch-run

# use `install_packages` if you need to install dependencies,
# for instance if you need git, just uncomment the line below.
RUN apt update && apt install -y --no-install-recommends \
    tzdata \
    build-essential \
    bzip2 \
    libnfc-dev \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Set our working directory
WORKDIR /usr/src/app

# Copy requirements.txt first for better cache on later pushes
COPY requirements.txt requirements.txt

# pip install python deps from requirements.txt on the resin.io build server
RUN pip install -r requirements.txt

# This will copy all files in our root to the working  directory in the container
COPY . ./

COPY config/libnfc.conf /etc/nfc/libnfc.conf

# Build the nfcutils used to read NFC cards
RUN bash -xc "\
pushd ./nfc; \
make; \
make install; \
popd; \
"

# app.py will run when container starts up on the device
CMD ["python","-u","src/app.py"]

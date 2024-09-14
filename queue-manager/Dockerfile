FROM python:3.12-alpine

# Don't run as root
RUN adduser -D appuser && \
  # Set the working directory in the container
  mkdir -p /home/appuser/app && \
  chown appuser:appuser /home/appuser/app && \
  # Use wget instead of curl since curl is external package in alpine
  # https://python-poetry.org/docs/#installation
  wget -O get-poetry.py https://install.python-poetry.org && \
  POETRY_HOME=/home/appuser/.poetry python3 get-poetry.py && \
  rm get-poetry.py

USER appuser

# Add Poetry to PATH
ENV PATH="/home/appuser/.poetry/bin:${PATH}"

# Install dependencies
COPY poetry.lock pyproject.toml ./
RUN poetry install

WORKDIR /home/appuser/app
COPY ./main.py .
CMD ["poetry", "run", "gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
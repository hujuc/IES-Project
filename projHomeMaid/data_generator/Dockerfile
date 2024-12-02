# Use an image with Python 3.11 (Alpine é uma opção mais leve, mas aqui usamos o Slim por padrão)
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install Poetry (for dependency management)
RUN pip install poetry

# Copy the pyproject.toml and poetry.lock files first to leverage Docker cache
COPY pyproject.toml poetry.lock* /app/

# Install dependencies using Poetry
RUN poetry install --only main --no-root

# Now copy the rest of the project files into the container
COPY . /app

# Ensure requests and kafka-python are installed via Poetry
RUN poetry add requests kafka-python

# Set the default command to run the data generator
CMD ["poetry", "run", "python3", "data_generator.py"]

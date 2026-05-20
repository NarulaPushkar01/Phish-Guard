FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production

# Install system dependencies needed for ReportLab and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create necessary directories
RUN mkdir -p uploads generated_reports

# Expose port (Render uses dynamic $PORT)
EXPOSE 10000

# Run gunicorn - uses Render's dynamic PORT env var
CMD sh -c "gunicorn --bind 0.0.0.0:${PORT:-10000} --workers 4 --timeout 120 wsgi:app"

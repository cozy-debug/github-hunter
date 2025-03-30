# Use python:alpine as base image
FROM python:alpine

# Install Node.js, npm and pnpm
RUN apk add --update nodejs npm && \
    npm install -g pnpm

# Copy all files from current directory to /workspace in container
COPY . /workspace

# Set working directory
WORKDIR /workspace

# Install backend Python dependencies
RUN pip install -r requirements.txt

# Install and build frontend
RUN cd github-hunter-app && \
    pnpm install && \
    pnpm build

# Expose port
EXPOSE 5000

# Start backend service
CMD cd backend && python main.py

# Scalable API with Node.js Clustering

## Overview

This project implements a scalable API using Node.js and the `cluster` module to take advantage of multi-core systems. Each CPU core runs a separate worker process to handle incoming requests efficiently. The API includes security enhancements, rate limiting, and logging.

## Features

- **Clustering**: Spawns worker processes on all available CPU cores.
- **Worker Monitoring**: Automatically restarts crashed workers.
- **Rate Limiting**: Prevents excessive requests from a single IP.
- **Logging**: Uses `morgan` for request logging.
- **Security Enhancements**: Implements `helmet` for security headers.
- **Compression**: Uses `compression` middleware for better performance.
- **CORS Support**: Enables cross-origin requests.
- **Health Check**: `/health` endpoint for monitoring worker status.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ashishgourr/scalable-cluster-api.git
   cd scalable-cluster-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

To start the API server:

```sh
node server.js
```

The server will:

- Fork worker processes equal to the number of CPU cores.

- Log worker startup and health status.

- Automatically restart crashed workers.

## Endpoints

### Root Endpoint

- **GET `/`**
  - Returns a message indicating which worker is handling the request.

### Health Check Endpoint

- **GET `/health`**
  - Returns the status of the worker along with its PID.

### Simulated Crash Endpoint

- **GET `/crash`**
  - Simulates a worker crash, triggering automatic restart.

## Dependencies

- `cluster` - Handles multi-core worker processes
- `express` - Web framework
- `helmet` - Security enhancements
- `compression` - Response compression
- `morgan` - Request logging
- `cors` - Enables CORS
- `rate-limiter-flexible` - Rate limiting
- `winston` - Provides advanced logging capabilities.

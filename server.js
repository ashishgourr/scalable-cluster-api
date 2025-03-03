import cluster from "cluster";
import os from "os";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import { RateLimiterMemory } from "rate-limiter-flexible";
import morgan from "morgan";
import cors from "cors";

// Fork workers for each CPU core

if (cluster.isPrimary) {
  // Get total CPU cores
  const numCPUs = os.cpus().length;

  console.log(`Master process is running. Forking for ${numCPUs} CPUs...`);

  // Fork workers equal to the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker crashes and auto-restart

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}. Restarting worker...`
    );

    cluster.fork();
  });
} else {
  // Worker process: Create an Express app

  const app = express();
  const port = 3000;

  // Middlewares

  app.use(cors()); // Enable CORS for all requests
  app.use(express.json()); // Middleware to parse JSON
  app.use(helmet()); // Security headers
  app.use(compression()); // Compression middleware
  app.use(morgan("combined")); // Logging middleware

  // Rate limiting configuration

  const rateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 1, // per 1 second
  });

  // Apply rate limiting middleware

  app.use((req, res, next) => {
    rateLimiter
      .consume(req.ip)
      .then(() => next())
      .catch(() => {
        res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      });
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.send(`Worker ${process.pid} is handling request`);
  });

  // Health endpoint

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      worker: cluster.worker.id,
      pid: process.pid,
    });
  });

  // Simulate a crash (for testing purposes)

  app.get("/crash", (req, res) => {
    console.log(
      `Worker ${cluster.worker.id} (PID: ${process.pid}) is crashing...`
    );
    // Exit with error code 1
    process.exit(1);
  });

  //Start the server

  app.listen(port, () => {
    console.log(
      `Worker ${cluster.worker.id} (PID: ${process.pid}) is running on port ${port}`
    );
  });
}

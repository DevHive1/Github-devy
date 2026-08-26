# Github-devy Dockerfile
# Multi-stage build for optimal production image
# Best Practices Applied:
# - Multi-stage build to reduce image size
# - Non-root user for security
# - Proper layer caching
# - Health checks
# - Environment variables

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.html ./

# Copy server configuration
COPY --from=builder /app/.env.example ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 9876

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:9876/api/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9876

# Command to run the application
CMD ["node", "dist/server.cjs"]

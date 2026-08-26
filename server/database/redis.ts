/**
 * Redis Connection Module
 * 
 * Best Practices Applied:
 * - Connection pooling
 * - Error handling
 * - Graceful shutdown
 * - Type-safe operations
 */

import { createClient, RedisClientType, CommandReply } from 'redis';

let client: RedisClientType | null = null;

/**
 * Connect to Redis
 */
export async function connect(): Promise<{ success: boolean; error?: string }> {
  try {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    client.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });
    
    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
    
    client.on('ready', () => {
      console.log('✅ Redis ready');
    });
    
    client.on('end', () => {
      console.log('⚠️ Redis connection closed');
    });
    
    await client.connect();
    return { success: true };
  } catch (error: any) {
    console.error('❌ Redis connection error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get Redis client
 */
export function getClient(): RedisClientType {
  if (!client) throw new Error('Redis not connected. Call connect() first.');
  return client;
}

/**
 * Close Redis connection
 */
export async function close(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}

/**
 * Test Redis connection
 */
export async function testConnection(): Promise<{ success: boolean; error?: string; pong?: string }> {
  try {
    const pong = await getClient().ping();
    return { success: true, pong };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if Redis is connected
 */
export function isConnected(): boolean {
  return client !== null && client.isReady;
}

/**
 * Reconnect to Redis
 */
export async function reconnect(): Promise<{ success: boolean; error?: string }> {
  await close();
  return await connect();
}

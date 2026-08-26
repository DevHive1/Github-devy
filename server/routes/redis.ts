/**
 * Redis API Routes
 * 
 * Endpoints:
 * - GET /api/redis/test - Test Redis connection
 * - GET /api/redis/keys - List all keys
 * - POST /api/redis/set - Set key-value pair
 * - GET /api/redis/get/:key - Get value by key
 * - DELETE /api/redis/del/:key - Delete key
 * - POST /api/redis/incr/:key - Increment key
 * - POST /api/redis/hset/:key - Set hash field
 * - GET /api/redis/hget/:key/:field - Get hash field
 * - GET /api/redis/hgetall/:key - Get all hash fields
 * - POST /api/redis/expire/:key - Set key expiration
 * - GET /api/redis/ttl/:key - Get key TTL
 * - DELETE /api/redis/flush - Flush all data
 */

import { Router } from 'express';
import {
  testConnection,
  getClient,
  isConnected,
  reconnect
} from '../database/redis';

const router = Router();

/**
 * GET /api/redis/test
 * Test Redis connection
 */
router.get('/test', async (req, res) => {
  const result = await testConnection();
  if (result.success) {
    res.json({ success: true, status: 'pong', pong: result.pong });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

/**
 * GET /api/redis/status
 * Check Redis connection status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    connected: isConnected()
  });
});

/**
 * POST /api/redis/reconnect
 * Reconnect to Redis
 */
router.post('/reconnect', async (req, res) => {
  const result = await reconnect();
  if (result.success) {
    res.json({ success: true, message: 'Redis reconnected successfully' });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

/**
 * GET /api/redis/keys
 * List all keys matching a pattern
 */
router.get('/keys', async (req, res) => {
  const { pattern = '*' } = req.query;
  
  try {
    const client = getClient();
    const keys = await client.keys(pattern as string);
    res.json({ success: true, keys });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/set
 * Set key-value pair with optional TTL
 */
router.post('/set', async (req, res) => {
  const { key, value, ttl } = req.body;
  
  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }
  
  try {
    const client = getClient();
    
    if (ttl) {
      await client.setEx(key, parseInt(ttl), value || '');
    } else {
      await client.set(key, value || '');
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/redis/get/:key
 * Get value by key
 */
router.get('/get/:key', async (req, res) => {
  const { key } = req.params;
  
  try {
    const client = getClient();
    const value = await client.get(key);
    res.json({ success: true, value });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/redis/del/:key
 * Delete key
 */
router.delete('/del/:key', async (req, res) => {
  const { key } = req.params;
  
  try {
    const client = getClient();
    const result = await client.del(key);
    res.json({ success: true, deleted: result > 0 });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/incr/:key
 * Increment key by 1
 */
router.post('/incr/:key', async (req, res) => {
  const { key } = req.params;
  const { by = 1 } = req.body;
  
  try {
    const client = getClient();
    const result = await client.incrBy(key, parseInt(by as string) || 1);
    res.json({ success: true, value: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/decr/:key
 * Decrement key by 1
 */
router.post('/decr/:key', async (req, res) => {
  const { key } = req.params;
  const { by = 1 } = req.body;
  
  try {
    const client = getClient();
    const result = await client.decrBy(key, parseInt(by as string) || 1);
    res.json({ success: true, value: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/hset/:key
 * Set hash field
 */
router.post('/hset/:key', async (req, res) => {
  const { key } = req.params;
  const { field, value } = req.body;
  
  if (!field) {
    return res.status(400).json({ error: 'Field is required' });
  }
  
  try {
    const client = getClient();
    await client.hSet(key, field, value || '');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/redis/hget/:key/:field
 * Get hash field
 */
router.get('/hget/:key/:field', async (req, res) => {
  const { key, field } = req.params;
  
  try {
    const client = getClient();
    const value = await client.hGet(key, field);
    res.json({ success: true, value });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/redis/hgetall/:key
 * Get all hash fields
 */
router.get('/hgetall/:key', async (req, res) => {
  const { key } = req.params;
  
  try {
    const client = getClient();
    const result = await client.hGetAll(key);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/expire/:key
 * Set key expiration in seconds
 */
router.post('/expire/:key', async (req, res) => {
  const { key } = req.params;
  const { seconds } = req.body;
  
  if (seconds === undefined) {
    return res.status(400).json({ error: 'Seconds is required' });
  }
  
  try {
    const client = getClient();
    const result = await client.expire(key, parseInt(seconds as string));
    res.json({ success: true, expired: result === 1 });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/redis/ttl/:key
 * Get key TTL (time to live) in seconds
 */
router.get('/ttl/:key', async (req, res) => {
  const { key } = req.params;
  
  try {
    const client = getClient();
    const ttl = await client.ttl(key);
    res.json({ success: true, ttl });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/flush
 * Flush all data (DANGEROUS - use with caution)
 */
router.post('/flush', async (req, res) => {
  try {
    const client = getClient();
    await client.flushDb();
    res.json({ success: true, message: 'All Redis data flushed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/redis/info
 * Get Redis server info
 */
router.get('/info', async (req, res) => {
  try {
    const client = getClient();
    const info = await client.info();
    res.json({ success: true, info });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/publish
 * Publish message to channel (Pub/Sub)
 */
router.post('/publish', async (req, res) => {
  const { channel, message } = req.body;
  
  if (!channel || !message) {
    return res.status(400).json({ 
      error: 'Channel and message are required' 
    });
  }
  
  try {
    const client = getClient();
    const subscribers = await client.publish(channel, message);
    res.json({ success: true, subscribers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/redis/subscribe
 * Subscribe to channel (Pub/Sub) - Note: This is a simple implementation
 */
router.post('/subscribe', async (req, res) => {
  const { channel } = req.body;
  
  if (!channel) {
    return res.status(400).json({ error: 'Channel is required' });
  }
  
  try {
    const client = getClient();
    // Note: In a real application, you would need to handle the subscription
    // and send messages back to the client via WebSocket or SSE
    await client.subscribe(channel);
    res.json({ success: true, message: `Subscribed to channel: ${channel}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

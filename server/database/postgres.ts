/**
 * PostgreSQL Database Connection Module
 * 
 * Best Practices Applied:
 * - Connection pooling for performance
 * - SSL support for production
 * - Graceful shutdown handling
 * - Type-safe query execution
 * - Error handling with proper types
 */

import { Pool, PoolClient, QueryResult } from 'pg';

// Connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://devy:devy123@localhost:5432/devy',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

/**
 * Connect to PostgreSQL (alias for testConnection)
 */
export async function connect(): Promise<{ success: boolean; error?: string; timestamp?: string }> {
  return testConnection();
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<{ success: boolean; error?: string; timestamp?: string }> {
  try {
    const client: PoolClient = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    return { success: true, timestamp: result.rows[0].current_time };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Execute a query with parameters
 */
export async function executeQuery(
  text: string,
  params?: any[]
): Promise<{ success: boolean; result?: QueryResult; error?: string }> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query(text, params);
    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

/**
 * Execute a transaction
 */
export async function executeTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<{ success: boolean; result?: T; error?: string }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return { success: true, result };
  } catch (error: any) {
    await client.query('ROLLBACK');
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

/**
 * Close the connection pool (for shutdown)
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

/**
 * Get table information
 */
export async function getTableInfo(tableName: string): Promise<{ success: boolean; columns?: any[]; error?: string }> {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    return { success: true, columns: result.rows };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * List all tables
 */
export async function listTables(): Promise<{ success: boolean; tables?: string[]; error?: string }> {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    return { success: true, tables: result.rows.map((row: any) => row.table_name) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if a table exists
 */
export async function tableExists(tableName: string): Promise<{ success: boolean; exists?: boolean; error?: string }> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      ) as exists
    `, [tableName]);
    return { success: true, exists: result.rows[0].exists };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default pool;

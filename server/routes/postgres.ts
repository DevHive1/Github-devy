/**
 * PostgreSQL API Routes
 * 
 * Endpoints:
 * - GET /api/postgres/test - Test database connection
 * - GET /api/postgres/tables - List all tables
 * - GET /api/postgres/tables/:name - Get table info
 * - POST /api/postgres/tables - Create a new table
 * - GET /api/postgres/:table - Get all records from table
 * - GET /api/postgres/:table/:id - Get single record by ID
 * - POST /api/postgres/:table - Insert new record
 * - PUT /api/postgres/:table/:id - Update record
 * - DELETE /api/postgres/:table/:id - Delete record
 * - POST /api/postgres/:table/query - Execute custom query
 */

import { Router } from 'express';
import {
  testConnection,
  executeQuery,
  getClient,
  executeTransaction,
  listTables,
  getTableInfo,
  tableExists
} from '../database/postgres';

const router = Router();

/**
 * GET /api/postgres/test
 * Test database connection
 */
router.get('/test', async (req, res) => {
  const result = await testConnection();
  if (result.success) {
    res.json({
      success: true,
      message: 'PostgreSQL connected successfully',
      timestamp: result.timestamp
    });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

/**
 * GET /api/postgres/tables
 * List all tables
 */
router.get('/tables', async (req, res) => {
  const result = await listTables();
  if (result.success) {
    res.json({ success: true, tables: result.tables || [] });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

/**
 * GET /api/postgres/tables/:name
 * Get table information (columns, types, etc.)
 */
router.get('/tables/:name', async (req, res) => {
  const { name } = req.params;
  const result = await getTableInfo(name);
  if (result.success) {
    res.json({ success: true, table: name, columns: result.columns || [] });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

/**
 * POST /api/postgres/tables
 * Create a new table
 */
router.post('/tables', async (req, res) => {
  const { tableName, schema } = req.body;
  
  if (!tableName) {
    return res.status(400).json({ error: 'tableName is required' });
  }
  
  if (!schema) {
    return res.status(400).json({ error: 'schema is required' });
  }
  
  try {
    // Check if table already exists
    const exists = await tableExists(tableName);
    if (exists.exists) {
      return res.status(409).json({ 
        success: false, 
        error: `Table '${tableName}' already exists` 
      });
    }
    
    // Create table with default columns
    const query = `
      CREATE TABLE ${tableName} (
        id SERIAL PRIMARY KEY,
        ${schema},
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    const result = await executeQuery(query);
    if (result.success) {
      res.json({ 
        success: true, 
        message: `Table '${tableName}' created successfully` 
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/postgres/:table
 * Get all records from a table with pagination and filtering
 */
router.get('/:table', async (req, res) => {
  const { table } = req.params;
  const {
    limit = '100',
    offset = '0',
    where = '',
    orderBy = '',
    order = 'ASC'
  } = req.query;
  
  try {
    let query = `SELECT * FROM ${table}`;
    const params: any[] = [];
    
    if (where) {
      query += ` WHERE ${where}`;
    }
    
    if (orderBy) {
      query += ` ORDER BY ${orderBy} ${order}`;
    }
    
    query += ` LIMIT $1 OFFSET $2`;
    params.push(parseInt(limit as string), parseInt(offset as string));
    
    const result = await executeQuery(query, params);
    if (result.success) {
      res.json({
        success: true,
        data: result.result?.rows || [],
        count: result.result?.rowCount || 0
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/postgres/:table/:id
 * Get single record by ID
 */
router.get('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  
  try {
    const result = await executeQuery(
      `SELECT * FROM ${table} WHERE id = $1`,
      [parseInt(id)]
    );
    
    if (result.success) {
      if (!result.result?.rows.length) {
        return res.status(404).json({ 
          success: false, 
          error: 'Record not found' 
        });
      }
      res.json({ success: true, data: result.result.rows[0] });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/postgres/:table
 * Insert new record
 */
router.post('/:table', async (req, res) => {
  const { table } = req.params;
  const { data } = req.body;
  
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ 
      error: 'Data is required and must be an object' 
    });
  }
  
  try {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await executeQuery(query, values);
    if (result.success) {
      res.json({ 
        success: true, 
        data: result.result?.rows[0] 
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/postgres/:table/:id
 * Update record
 */
router.put('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const { data } = req.body;
  
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ 
      error: 'Data is required and must be an object' 
    });
  }
  
  try {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    const values = [...Object.values(data), parseInt(id)];
    
    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const result = await executeQuery(query, values);
    if (result.success) {
      if (!result.result?.rows.length) {
        return res.status(404).json({ 
          success: false, 
          error: 'Record not found' 
        });
      }
      res.json({ success: true, data: result.result.rows[0] });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/postgres/:table/:id
 * Delete record
 */
router.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  
  try {
    const result = await executeQuery(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [parseInt(id)]
    );
    
    if (result.success) {
      if (!result.result?.rows.length) {
        return res.status(404).json({ 
          success: false, 
          error: 'Record not found' 
        });
      }
      res.json({
        success: true,
        message: 'Record deleted successfully',
        data: result.result.rows[0]
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/postgres/:table/query
 * Execute custom query on table
 */
router.post('/:table/query', async (req, res) => {
  const { table } = req.params;
  const { query: customQuery, params = [] } = req.body;
  
  if (!customQuery) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  try {
    // Sanitize table name to prevent SQL injection
    const sanitizedQuery = customQuery.replace(/\b\w+\b/g, (word) => {
      if (word.toLowerCase() === table.toLowerCase()) {
        return table;
      }
      return word;
    });
    
    const result = await executeQuery(sanitizedQuery, params);
    if (result.success) {
      res.json({
        success: true,
        data: result.result?.rows || [],
        rowCount: result.result?.rowCount || 0
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/postgres/transaction
 * Execute multiple queries in a transaction
 */
router.post('/transaction', async (req, res) => {
  const { queries } = req.body;
  
  if (!queries || !Array.isArray(queries)) {
    return res.status(400).json({ 
      error: 'Queries array is required' 
    });
  }
  
  try {
    const result = await executeTransaction(async (client) => {
      const results: any[] = [];
      for (const { text, params } of queries) {
        const res = await client.query(text, params);
        results.push({
          rowCount: res.rowCount,
          rows: res.rows
        });
      }
      return results;
    });
    
    if (result.success) {
      res.json({ success: true, results: result.result });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default_user';
    
    const query = `
      SELECT 
        su.*, 
        u.name, 
        u.image_path, 
        u.description, 
        COALESCE(u.stats::text, '{}') as stats,
        COALESCE(u.transport_capacity::text, '{}') as transport_capacity,
        u.max_capacity,
        u.can_be_transported,
        u.transport_size
      FROM selected_units su
      JOIN units u ON su.unit_id = u.unit_id
      WHERE su.user_id = $1
      ORDER BY su.category, su.selected_order
    `;
    
    const result = await pool.query(query, [userId]);
    
    // Parse JSON fields
    const parsedRows = result.rows.map(row => ({
      ...row,
      stats: typeof row.stats === 'string' ? JSON.parse(row.stats) : row.stats || {},
      transport_capabilities: typeof row.transport_capabilities === 'string' 
        ? JSON.parse(row.transport_capabilities) 
        : row.transport_capabilities || {}
    }));
    
    return NextResponse.json(parsedRows);
  } catch (error) {
    console.error('Error fetching selected units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch selected units' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitId, category, userId = 'default_user' } = body;
    
    // First, check if the unit exists in the units table
    const unitCheck = await pool.query(
      'SELECT * FROM units WHERE unit_id = $1',
      [unitId]
    );
    
    if (unitCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }
    
    // Check if category already has 3 selections
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM selected_units 
      WHERE category = $1 AND user_id = $2
    `;
    
    const countResult = await pool.query(countQuery, [category, userId]);
    
    if (countResult.rows[0].count >= 3) {
      return NextResponse.json(
        { error: `Maximum 3 units allowed in ${category} category` },
        { status: 400 }
      );
    }
    
    // Check if unit is already selected by this user
    const existingQuery = `
      SELECT * FROM selected_units 
      WHERE unit_id = $1 AND user_id = $2
    `;
    
    const existingResult = await pool.query(existingQuery, [unitId, userId]);
    
    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Unit already selected' },
        { status: 400 }
      );
    }
    
    // Get the next selection order
    const orderQuery = `
      SELECT COALESCE(MAX(selected_order), 0) + 1 as next_order
      FROM selected_units 
      WHERE category = $1 AND user_id = $2
    `;
    
    const orderResult = await pool.query(orderQuery, [category, userId]);
    const nextOrder = orderResult.rows[0].next_order;
    
    // Insert the selection
    const insertQuery = `
      INSERT INTO selected_units (unit_id, category, selected_order, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [unitId, category, nextOrder, userId]);
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error selecting unit:', error);
    return NextResponse.json(
      { error: 'Failed to select unit' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitId, selectedOrder, userId = 'default_user' } = body;
    
    const query = `
      UPDATE selected_units 
      SET selected_order = $1
      WHERE unit_id = $2 AND user_id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [selectedOrder, unitId, userId]);
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Unit not found in selections' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating unit order:', error);
    return NextResponse.json(
      { error: 'Failed to update unit order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');
    const userId = searchParams.get('userId') || 'default_user';
    
    if (!unitId) {
      return NextResponse.json(
        { error: 'unitId is required' },
        { status: 400 }
      );
    }
    
    // Simple delete without reordering
    const deleteQuery = `
      DELETE FROM selected_units 
      WHERE unit_id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(deleteQuery, [unitId, userId]);
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Unit not found in selections' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Unit removed successfully'
    });
    
  } catch (error) {
    console.error('Error removing unit:', error);
    return NextResponse.json(
      { error: 'Failed to remove unit' },
      { status: 500 }
    );
  }
}
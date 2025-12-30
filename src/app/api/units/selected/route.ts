import { NextRequest, NextResponse } from 'next/server';
import { SelectedUnitService } from '@/services/selected-unit.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default_user';

    const selectedUnits = await SelectedUnitService.getByUser(userId);

    return NextResponse.json(selectedUnits);
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

    const selectedUnit = await SelectedUnitService.add(unitId, category, userId);

    return NextResponse.json(selectedUnit);
  } catch (error: any) {
    console.error('Error selecting unit:', error);

    if (error.message === 'Unidade já selecionada') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error.message.includes('Máximo de 3 unidades')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

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

    const result = await SelectedUnitService.updateOrder(unitId, selectedOrder, userId);

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Unit not found in selections' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
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

    await SelectedUnitService.remove(unitId, userId);

    return NextResponse.json({
      success: true,
      message: 'Unit removed successfully'
    });

  } catch (error: any) {
    console.error('Error removing unit:', error);

    if (error.message === 'Unidade não encontrada nas seleções') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to remove unit' },
      { status: 500 }
    );
  }
}
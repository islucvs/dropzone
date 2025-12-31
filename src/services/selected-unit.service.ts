import db from '@/lib/db'

export class SelectedUnitService {
  static async getByUser(userId: string = 'default_user') {
    const selectedUnits = await db.selectedUnit.findMany({
      where: { userId },
      include: {
        unit: true
      },
      orderBy: [
        { category: 'asc' },
        { selectedOrder: 'asc' }
      ]
    })

    return selectedUnits.map(su => ({
      id: su.id,
      unit_id: su.unitId,
      category: su.category,
      selected_order: su.selectedOrder,
      user_id: su.userId,
      name: su.unit.name,
      image_path: su.unit.imagePath,
      description: su.unit.description,
      stats: su.unit.stats,
      transport_capacity: su.unit.transportCapacity,
      max_capacity: su.unit.maxCapacity,
      can_be_transported: su.unit.canBeTransported,
      transport_size: su.unit.transportSize
    }))
  }

  static async countByCategory(category: string, userId: string = 'default_user'): Promise<number> {
    return await db.selectedUnit.count({
      where: {
        category,
        userId
      }
    })
  }

  static async exists(unitId: string, userId: string = 'default_user'): Promise<boolean> {
    const unit = await db.selectedUnit.findFirst({
      where: {
        unitId,
        userId
      }
    })
    return !!unit
  }

  static async add(unitId: string, category: string, userId: string = 'default_user') {
    const count = await this.countByCategory(category, userId)

    if (count >= 3) {
      throw new Error(`Máximo de 3 unidades permitido na categoria ${category}`)
    }

    const alreadyExists = await this.exists(unitId, userId)
    if (alreadyExists) {
      throw new Error('Unidade já selecionada')
    }

    const nextOrder = count + 1

    const selectedUnit = await db.selectedUnit.create({
      data: {
        unitId,
        category,
        selectedOrder: nextOrder,
        userId
      },
      include: {
        unit: true
      }
    })

    return {
      id: selectedUnit.id,
      unit_id: selectedUnit.unitId,
      category: selectedUnit.category,
      selected_order: selectedUnit.selectedOrder,
      user_id: selectedUnit.userId,
      name: selectedUnit.unit.name,
      image_path: selectedUnit.unit.imagePath,
      description: selectedUnit.unit.description,
      stats: selectedUnit.unit.stats,
      transport_capacity: selectedUnit.unit.transportCapacity,
      max_capacity: selectedUnit.unit.maxCapacity,
      can_be_transported: selectedUnit.unit.canBeTransported,
      transport_size: selectedUnit.unit.transportSize
    }
  }

  static async updateOrder(unitId: string, selectedOrder: number, userId: string = 'default_user') {
    return await db.selectedUnit.updateMany({
      where: {
        unitId,
        userId
      },
      data: {
        selectedOrder
      }
    })
  }

  static async remove(unitId: string, userId: string = 'default_user') {
    const result = await db.selectedUnit.deleteMany({
      where: {
        unitId,
        userId
      }
    })

    if (result.count === 0) {
      throw new Error('Unidade não encontrada nas seleções')
    }

    return result
  }

  static async removeAll(userId: string = 'default_user') {
    return await db.selectedUnit.deleteMany({
      where: { userId }
    })
  }

  static async getByCategory(category: string, userId: string = 'default_user') {
    return await db.selectedUnit.findMany({
      where: {
        category,
        userId
      },
      include: {
        unit: true
      },
      orderBy: {
        selectedOrder: 'asc'
      }
    })
  }
}

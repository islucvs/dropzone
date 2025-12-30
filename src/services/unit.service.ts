import db from '@/lib/db'

export class UnitService {
  static async getAll() {
    return await db.unit.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })
  }

  static async getByCategory(category: string) {
    return await db.unit.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    })
  }

  static async getById(unitId: string) {
    return await db.unit.findUnique({
      where: { unitId }
    })
  }

  static async exists(unitId: string): Promise<boolean> {
    const unit = await db.unit.findUnique({
      where: { unitId },
      select: { unitId: true }
    })
    return !!unit
  }

  static async getCategories(): Promise<string[]> {
    const units = await db.unit.findMany({
      select: {
        category: true
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc'
      }
    })
    return units.map(u => u.category)
  }
}

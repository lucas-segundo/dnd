import { Class } from 'domain/entities/Class'
import { adaptPrismaClass } from './index'
import { mockPrismaClass } from 'infra/prisma/data/Class/mock'

describe('adaptPrismaClass', () => {
  it('should correctly adapt a PrismaClass to a Class', () => {
    const prismaClass = mockPrismaClass()

    const expectedClass: Class = {
      id: prismaClass.id.toString(),
      name: prismaClass.name,
      subclasses: [],
    }

    const result = adaptPrismaClass(prismaClass)

    expect(result).toEqual(expectedClass)
  })
})

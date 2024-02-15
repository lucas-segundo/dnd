import {
  mockCharacterClassCreater,
  mockCharacterClassCreaterParams,
} from 'domain/useCases/CharacterClassCreater/mock'
import {
  CharacterClassCreaterController,
  CharacterClassCreaterControllerParams,
} from '.'
import { mockCharacterClass } from 'domain/entities/CharacterClass/mock'
import { UnexpectedError } from 'domain/errors/UnexpectedError'
import {
  HTTPErrorResponse,
  HTTPResponse,
} from 'presentation/interfaces/Controller'

const makeSUT = () => {
  const characterClassCreater = mockCharacterClassCreater()
  const sut = new CharacterClassCreaterController(characterClassCreater)

  return { sut, characterClassCreater }
}

describe('CharacterClassCreater', () => {
  it('should call creater with right params', async () => {
    const { sut, characterClassCreater } = makeSUT()
    const characterClassToCreate = mockCharacterClassCreaterParams()

    const params: CharacterClassCreaterControllerParams = {
      data: characterClassToCreate,
    }

    await sut.handle(params)

    expect(characterClassCreater.create).toHaveBeenCalledWith(
      characterClassToCreate,
    )
  })

  it('should return 201 and the created character class', async () => {
    const { sut, characterClassCreater } = makeSUT()

    const characterClassToCreate = mockCharacterClassCreaterParams()
    const createdCharacterClass = {
      ...mockCharacterClass(),
      ...characterClassToCreate,
    }

    characterClassCreater.create.mockResolvedValue(createdCharacterClass)

    const params: CharacterClassCreaterControllerParams = {
      data: characterClassToCreate,
    }

    const response = (await sut.handle(params)) as HTTPResponse

    expect(response.statusCode).toBe(201)
    expect(response.data).toEqual(createdCharacterClass)
  })

  it('should return 500 if creater throws unexpected error', async () => {
    const { sut, characterClassCreater } = makeSUT()

    const error = new UnexpectedError()
    characterClassCreater.create.mockRejectedValue(new UnexpectedError())

    const params: CharacterClassCreaterControllerParams = {
      data: mockCharacterClassCreaterParams(),
    }

    const response = (await sut.handle(params)) as HTTPErrorResponse

    expect(response.statusCode).toBe(500)
    expect(response.errors).toEqual([error.message])
  })
})

import { Subclass } from '../Subclass'

export interface Class {
  id: string
  name: string
  subclasses: Subclass[]
}

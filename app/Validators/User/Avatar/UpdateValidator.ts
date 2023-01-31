import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    file: schema.file({
      size:'5mb',
      extnames: ['jpg','png','jpeg']
    })
  })

  public messages: CustomMessages = {}
}

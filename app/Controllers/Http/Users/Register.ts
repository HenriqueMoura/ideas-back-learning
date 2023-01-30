import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey, UserKey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register'
import { faker } from '@faker-js/faker'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class UserRegistersController {
  public async store({ request }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)

    const user = await User.create({ email })
    await user.save()

    const key = faker.datatype.uuid() + new Date().getTime()
    user.related('key').create({ key })
    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`
    await Mail.send((menssage) => {
      menssage.to(email)
      menssage.from('contato@teste.com', 'teste')
      menssage.subject('Criação de conta')
      menssage.htmlView('emails/register', { link })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()
    return user
  }
  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)

    const user = await userKey.related('user').query().firstOrFail()

    const username = name.split(' ')[0].toLocaleLowerCase() + new Date().getTime()

    user.merge({ name, password, username })

    await user.save()
    await userKey.delete()

    return response.ok({ menssage: 'ok' })
  }
}

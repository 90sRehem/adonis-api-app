'use strict'

const User = use('App/Models/User')

const Database = use('Database')

class UserController {
  async index () {
    const user = await User.all()

    delete user.password

    return user
  }

  async show ({ params }) {
    const user = await User.findOrFail(params.id)

    await user.load('roles')
    await user.load('permissions')

    return user
  }

  async store ({ request }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.create(data, trx)

    await user.addresses().createMany(addresses, trx)

    if (roles) {
      await user.roles().attach(roles)
    }

    if (permissions) {
      await user.permissions().attach(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    await trx.commit()

    return user
  }

  async update ({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const trx = await Database.beginTransaction()

    const user = await User.findOrFail(params.id, trx)

    user.merge(data)

    await user.save()

    if (roles) {
      await user.roles().sync(roles)
    }

    if (permissions) {
      await user.permissions().sync(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    await trx.commit()

    return user
  }
}

module.exports = UserController

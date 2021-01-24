'use strict'
// const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    return token

    // const { email, password } = request.all()

    // const user = await User.findByOrFail('email', email)
    // const token = await auth.attempt(email, password)

    // user.token = token.token
    // user.token_created_at = new Date()

    // await user.save()

    // return user
  }
}

module.exports = SessionController

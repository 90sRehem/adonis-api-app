'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const Env = use('Env')
const Youch = use('youch')
const Config = use('Config')

const Sentry = require('@sentry/node')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }

    if (Env.get('NODE_ENV') === 'development') {
      const youch = new Youch(error, request.request)

      const errorJSON = await youch.toJSON()

      return response.status(error.status).send(errorJSON)
    }

    response.status(error.status)
  }

  async report (error, { request }) {
    Sentry.init({
      dsn: Config.get('services.sentry.dsn'),
      tracesSampleRate: 1.0
    })

    Sentry.captureException(error)
  }
}

module.exports = ExceptionHandler

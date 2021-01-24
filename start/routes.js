'use strict'

const Route = use('Route')

Route.group(() => {
  Route.get('users', 'UserController.index').middleware('auth')
  Route.get('users/:id', 'UserController.show').middleware('auth')
  Route.post('users', 'UserController.store').validator('User')
  Route.put('users/:id', 'UserController.update').middleware('auth')
})

Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('forgotPassword', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('forgotPassword', 'ForgotPasswordController.update').validator('ResetPassword')

Route.get('/files/:id', 'FileController.show')

Route.group(() => {
  Route.post('/files', 'FileController.store')
  Route
    .resource('projects', 'ProjectController')
    .apiOnly()
    // .except(['index', 'show'])
    .validator(new Map(
      [
        [
          ['projects.store'],
          ['Project']
        ]
      ]
    ))
  Route
    .resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map(
      [
        [
          ['projects.tasks.store'],
          ['Task']
        ]
      ]
    ))
}).middleware(['auth', 'is: (admin)'/* , 'can:show_tasks' */])

Route.resource('permissions', 'PermissionController').apiOnly().middleware('auth')
Route.resource('roles', 'RoleController').apiOnly().middleware('auth')

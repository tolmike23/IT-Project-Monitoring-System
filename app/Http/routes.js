'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')
const Helpers = use('Helpers')

Route.get('/', 'AuthController.index')

Route.get('/login', 'AuthController.index')
Route.post('/login', 'AuthController.login')

Route.get('/register', 'RegisterController.index')
Route.post('/register', 'RegisterController.doRegister')

Route.get('/logout', 'AuthController.logout')

Route.get('/advisers', 'AdviserController.show')
Route.post('/advisers', 'AdviserController.add')
Route.post('/addAdviser', 'AdviserController.call')

Route.get('/dashboard', 'DashboardController.showGroup')
Route.get('/joinGroup', 'GroupController.join')


//File Upload
Route.post('/file', 'DashboardController.store')
//Display File
Route.get('/*', 'DashboardController.download')
//Add Work Break Down Structure
Route.post('/mustWork', 'DashboardController.mustHave')




//--------------------------------NOT USED ROUTES--------------------------------
// Route.post('/dashboard', 'GroupController.add')
// Route.post('/addGroup', 'GroupController.add')
// Route.get('/editGroup', 'GroupController.edit')
//
// Route.post('/updateMember', 'GroupController.post')
// Route.get('/adviserDashboard', 'DashboardController.showAdviser')
//
// Route.get('/projects', 'ProjectsController.show')
// Route.post('/addProject', 'ProjectsController.call')
// Route.post('/Projects', 'ProjectsController.add')
//
// Route.post('/addRequirements', 'RequirementsController.create')
//
// Route.post('/addPanel','PanelistController.create')
//
// Route.get('errors.passwordNotMatch','RegisterController.doRegister')

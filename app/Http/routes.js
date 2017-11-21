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

//Home Page
Route.get('/', 'AuthController.index')
//Login Page
Route.get('/login', 'AuthController.index')
Route.post('/login', 'AuthController.login')
Route.get('/dashboardOptions','DashboardController.facultyOpt')
Route.post('/viewAs','DashboardController.viewAs')
//Register Page
Route.get('/register', 'RegisterController.index')
Route.post('/register', 'RegisterController.doRegister')
Route.get('errors.passwordNotMatch','RegisterController.doRegister')
//Logout
Route.get('/logout', 'AuthController.logout')
//Adviser Page
Route.get('/adviserDashboard', 'AdviserController.showAdviser')
Route.get('/confirm', 'AdviserController.confirm')
Route.post('/advisers', 'AdviserController.add')
Route.post('/addAdviser', 'AdviserController.call')
//Coordinator View
Route.get('/coordinatorDashboard','CoordinatorController.showCoordinator')
Route.post('/createGroup', 'CoordinatorController.createGroup')
Route.post('/createProject', 'CoordinatorController.createProject')
Route.post('/inserMustHave', 'CoordinatorController.insertReq')

//Group Page
Route.get('/dashboard', 'DashboardController.showGroup')
Route.get('/adviserDashboard', 'DashboardController.showAdviser')

Route.post('/dashboard', 'GroupController.add')
Route.post('/addGroup', 'GroupController.add')
Route.post('/updateMember', 'GroupController.post')
Route.get('/editGroup', 'GroupController.edit')
Route.get('/joinGroup', 'GroupController.join')

Route.post('/submitProposal', 'EndorseController.submitProposal')
Route.get('/editEndorse', 'EndorseController.edit')
Route.get('/updateProposal', 'EndorseController.updateProposal')

Route.get('/projects', 'ProjectsController.show')
Route.post('/addProject', 'ProjectsController.call')
Route.post('/Projects', 'ProjectsController.add')

Route.post('/addRequirements', 'RequirementsController.create')

Route.post('/addPanel','PanelistController.create')

Route.get('errors.passwordNotMatch','RegisterController.doRegister')


//------------------Jd Start------------------------------
//Notification

//File Upload
Route.post('/file', 'DashboardController.store')
//Display File
Route.get('users/*', 'DashboardController.download')
//Add Work Break Down Structure
Route.post('/addWork', 'DashboardController.mustHave')
//Edit Work Break Down Structure Display Modal
Route.get('/editWork', 'DashboardController.sendEditWbs')
//Edit Work Break Down Structure post
Route.post('/updateWbs', 'DashboardController.updateWbs')
//Notifications Read
Route.get('read/*', 'DashboardController.read')
//Project
Route.get('/projects', 'ProjectsController.show')
Route.post('/addProject', 'ProjectsController.call')
Route.post('/Projects', 'ProjectsController.add')
//Requirements
Route.post('/addRequirements', 'RequirementsController.create')
//Panelist
Route.post('/addPanel','PanelistController.create')

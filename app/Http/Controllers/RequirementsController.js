'use strict'


const Req = use('App/Model/Requirement')
const Group = use('App/Model/Group')
const Projects = use('App/Model/Project')
class RequirementsController {

  * index(request, response) {
    //
  }

  * create(request, response) {
    //
	const user = yield request.auth.getUser()
	const req = new Req()
	req.projectId = request.input('project')
	req.must_have = request.input('mustHave')
	req.deadline = request.input('deadline')
	req.notes = request.input('notes')	
	yield req.save()
	
	const projects = yield Projects.all()
	const group = yield Group.query().where('email', user.email).fetch()	
	const requirements = yield Req.query().where('projectId', request.input('project')).fetch()
	
	yield response.sendView('dashboard', {group:group.toJSON(), requirements:requirements.toJSON(), projects:projects.toJSON()})
  }

  * store(request, response) {
    //
  }

  * show(request, response) {
    //
  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    //
  }

  * destroy(request, response) {
    //
  }

}

module.exports = RequirementsController

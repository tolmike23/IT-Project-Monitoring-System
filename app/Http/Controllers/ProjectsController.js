'use strict'

const Projects = use('App/Model/Projects')
const Advisers = use('App/Model/Advisers')

class ProjectsController {
	
    
    * show (request, response) {
        const projects = yield Projects.all()
		yield response.sendView('projects', {projects:projects.toJSON()})		
	}
    
    * call (request, response) {
        const advisers = yield Advisers.all()
        
        yield response.sendView('addProject', {advisers:advisers.toJSON()})
    }
    
	* add (request, response) {
        const project = new Projects()
        project.projectname = request.input('projName')
        project.adviser = request.input('adviser')
        project.status = request.input('status')
        project.notes = request.input('notes')
        yield project.save()
        
        const projects = yield Projects.all()
		yield response.sendView('projects', {projects:projects.toJSON()})		
	}
    
    * edit (request, response){
        
    }

}

module.exports = ProjectsController
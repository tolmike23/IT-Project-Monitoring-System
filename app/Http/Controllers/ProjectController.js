'use strict'

class ProjectController {
	
    
    * show (request, response) {
		yield response.sendView('projects')		
	}
    
	* add (request, response) {
		yield response.sendView('projects')		
	}
    
    * edit (request, response){
        
    }

}

module.exports = ProjectController
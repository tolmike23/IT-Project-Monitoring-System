'use strict'

const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Projects')
const Panelist = use('App/Model/Panelist')
const Requirements = use('App/Model/Requirement')
const Endorse = use('App/Model/Endorse')

class AdviserController {
  /*Adviser Show
    -Show Group Proposal Under This Adviser
    -Show Group Project Under This Adviser
    -Show Group Requirements Under This Adviser
  */
  * showAdviser (request, response){
    const user = yield request.auth.getUser()
    //Proposal
    const proposals = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId').fetch()
    //Project & Requirements
    const projects = yield Projects.query().innerJoin('group_controls', 'projects.groupId', 'group_controls.groupId').where('projects.adviser', user.email).fetch()

    const projectJson = JSON.stringify(projects)
    const projectParse = JSON.parse(projectJson)
    var projObjWbs = []
    for(var i=0; i<projectParse.length; i++){
      var requirements = yield Requirements.query().innerJoin('projects', 'requirements.projectId', 'projects.id')
                        .where('requirements.projectId', projectParse[i].id).fetch()
      var reqString = JSON.stringify(requirements)
      var reqParse = JSON.parse(reqString)
      //Push a new obj
      for(var l=0; l<reqParse.length; l++){
       var tempData = reqParse[l]
        projObjWbs.push({
          "projectName" : tempData.projectname,
          "deadline" : tempData.deadline,
          "must" : tempData.must_have,
          "milestone" : tempData.milestone
        })
      }
		}
    projObjWbs = JSON.parse(JSON.stringify(projObjWbs))
    console.log("Endorse Data: " + JSON.stringify(proposals))
		yield response.sendView('adviserDashboard', {projects:projects.toJSON(), projObjWbs, proposals:proposals.toJSON(), user:false})

	}

  * call (request, response) {
    yield response.sendView('addAdviser')
  }

  * add (request, response) {
    const adviser = new Advisers()
    adviser.email = request.input("email")
    adviser.firstname = request.input("firstname")
    adviser.lastname = request.input("lastname")
    adviser.status = "active"
    adviser.role = request.input("role")
    yield adviser.save()

    const advisers = yield Advisers.all()
    yield response.sendView('advisers', {advisers:advisers.toJSON()} )

  }

  * edit (request, response){

  }

}

module.exports = AdviserController

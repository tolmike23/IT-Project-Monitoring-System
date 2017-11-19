'use strict'
const Database = use('Database')
const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Project')
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
    //Proposal Null
    const proposals = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
                                  .where({endorseTo: user.email, confirmed:null}).fetch()
    //Proposal Disapproved
    const proposalsDis = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
                                  .where({endorseTo: user.email, confirmed: 0}).fetch()
    //Proposal Approved
    const proposalsApp = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
                                  .where({endorseTo: user.email, confirmed: 1}).fetch()


    //Project & Requirements
    const projects = yield Database.schema.raw("select p.id,g.groupName,p.projectname,p.created_at,p.status,p.notes from projects as p inner join group_controls as g on p.groupId = g.groupId where p.adviser='"
                      + user.email + "'")

    const projectJson = JSON.stringify(projects[0])
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
		yield response.sendView('adviserDashboard', {projectParse, projObjWbs, proposals:proposals.toJSON(),
          proposalsApp:proposalsApp.toJSON(), proposalsDis:proposalsDis.toJSON(),user:false})

	}

  * confirm (request, response) {
    var todayDate = new Date()//Today date
    const dateConfirm = todayDate
    const proId = request.input('projectId')
    const confirm = request.input('approved')
    yield Endorse.query().where('id', proId).update({confirmed: confirm, confirmDate: dateConfirm})
		return response.redirect('back')

    //add new confirm record Approved
    /*
    -groupId
    -id adviser
    -description
    -endorseType
    -endorseByAdmin
    -endorseToCoordinatorEmail
    -confirmed 1
    -confirmed Date
    -notes
    */
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

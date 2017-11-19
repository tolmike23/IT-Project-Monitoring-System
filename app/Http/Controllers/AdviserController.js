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
                                  .where({endorseTo: user.email, confirmed:null, endorseType: 'Proposal'}).fetch()
    //Proposal Disapproved
    const proposalsDis = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
                                  .where({endorseTo: user.email, confirmed: 0, endorseType: 'Proposal'}).fetch()
    //Proposal Approved
    const proposalsApp = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
                                  .where({endorseTo: user.email, confirmed: 1, endorseType: 'Proposal'}).fetch()


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
    //Update Proposal
    var todayDate = new Date()//Today date
    const dateConfirm = todayDate
    const proId = request.input('projectId')
    const studentId = request.input('studentId')
    const groupId = request.input('groupId')
    const endorseBy = request.input('endorseBy')
    const confirm = request.input('approved')
    const desc = request.input('description')
    yield Endorse.query().where('id', proId).update({confirmed: confirm, confirmDate: dateConfirm})
    //Insert New Updated Proposal
    if(confirm == 0){
      return response.redirect('back')
    }else{
      const endorse = new Endorse()
      endorse.groupId = groupId
      endorse.studentId = studentId
      endorse.description = desc
      endorse.endorseType = "Endorse to Coordinator"
      endorse.endorseBy = endorseBy
      const groupControl = yield Database.select('coordinator')
      .from('group_controls').where('groupId', groupId)
      const gcJson = JSON.stringify(groupControl)
      const gcParse = JSON.parse(gcJson)
      endorse.endorseTo = gcParse[0].coordinator
      endorse.confirmed = 1
      endorse.confirmDate = dateConfirm
      yield endorse.save()

      return response.redirect('back')
    }

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

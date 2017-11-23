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



    // Project & Requirements For Adviser
    const projects = yield Database.select('g.groupName', 'p.projectname', 'p.created_at','p.status','p.notes').from('projects as p')
    .innerJoin('group_controls as g','p.groupId','g.groupId').where('g.adviser',user.email)


		yield response.sendView('adviserDashboard', {projects,proposals:proposals.toJSON(),
    proposalsApp:proposalsApp.toJSON(), proposalsDis:proposalsDis.toJSON(),user:true})

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
    const groupControl = yield Database.select('coordinator')
    .from('group_controls').where('groupId', groupId)
    const gcJson = JSON.stringify(groupControl)
    const gcParse = JSON.parse(gcJson)
    //Insert New Updated Proposal
    yield Endorse.query().where('id', proId).update({confirmed: confirm, confirmDate: dateConfirm})
    if(confirm <= 0 )
    {
      return response.redirect('back')
    }else{
      const endorse = new Endorse()
      endorse.groupId = groupId
      endorse.studentId = studentId
      endorse.description = desc
      endorse.endorseType = "Endorse to Coordinator"
      endorse.endorseBy = endorseBy
      endorse.endorseTo = gcParse[0].coordinator
      endorse.confirmed = 1
      endorse.notes = "confirm"
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

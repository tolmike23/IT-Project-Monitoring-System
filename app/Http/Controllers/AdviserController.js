'use strict'
const Database = use('Database')
const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Project')
const Panelist = use('App/Model/Panelist')
const Requirements = use('App/Model/Requirement')
const Endorse = use('App/Model/Endorse')
const Notification = use('App/Model/Notification')

class AdviserController {
  /*Adviser Show
    -Show Group Proposal Under This Adviser
    -Show Group Project Under This Adviser
    -Show Group Requirements Under This Adviser
  */
  * showAdviser (request, response){
    //User
    const user = yield request.auth.getUser()

    //Proposal Null

    const proposals = yield Database.select('g.groupId','g.groupName','e.description','e.endorseType', 'e.notes', 'e.created_at', 'e.id', '.e.endorseTo')
    .from('endorses as e')
    .innerJoin('group_controls as g','e.groupId', 'g.groupId')
    .where({endorseTo: user.email, confirmed:null, endorseType: 'Proposal'})

    //Proposal Disapproved
    const proposalsDis = yield Endorse.query().innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
    .where({endorseTo: user.email, confirmed: 0, endorseType: 'Proposal'}).fetch()

    //Proposal Approved
    const proposalsApp = yield Endorse.query()
    .innerJoin('group_controls','endorses.groupId', 'group_controls.groupId')
    .where({endorseTo: user.email, confirmed: 1, endorseType: 'Proposal'}).fetch()

    //Work Break Down Structure
    const wbs = yield yield Database.select('g.groupName', 'm.workId', 'm.description', 'm.status','m.startdate','m.enddate','m.email','m.updated_at')
    .from('workbreakdowns as m')
    .innerJoin('group_controls as g','m.groupId','g.groupId')
    .where('g.adviser',user.email)

    // Project
    const projects = yield Database.select('g.groupName', 'p.projectname', 'p.created_at','p.status','p.notes', 'p.id')
    .from('projects as p')
    .innerJoin('group_controls as g','p.groupId','g.groupId')
    .where('g.adviser',user.email)

    //Project Requirements
    const requirements = yield Database.select('r.projectId','r.must_have','r.deadline')
    .from('requirements as r')
    .innerJoin('group_controls as g', 'r.groupId', 'g.groupId')
    .where('g.adviser',user.email)

    // Notifications Fetch Data
    const notifyAd = yield Database.select('n.groupId', 'n.category', 'n.id','g.groupName').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.adviser',user.email).where('n.statusAdviser', 0)

    //Notification Counter
    const adCounter = yield Database.select('n.groupId').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.adviser',user.email).where('n.statusAdviser', 0).count('* as counter')
    const adstring = JSON.stringify(adCounter)
    const notifyCounterAd = JSON.parse(adstring)
    const counterAdviser = notifyCounterAd[0].counter

    //Group List View
    const groupList = yield Database.select('gc.groupId','gc.groupName', 'gc.chairman', 'gc.adviser', 'gc.coordinator')
    .from('group_controls as gc')
    .where('gc.adviser', user.email)

    //Groups Tables
    const groups = yield Database.from('groups')

    //Return View
    yield response.sendView('adviserDashboard', {projects,proposals,
    proposalsApp:proposalsApp.toJSON(), proposalsDis:proposalsDis.toJSON(),
    notifyAd, counterAdviser, wbs, requirements, user:true, groupList, groups})

	}

  * confirm (request, response) {
    //Update Proposal
    var todayDate = new Date()//Today date
    const dateConfirm = todayDate
    const eId = request.input('eid')
    const studentId = request.input('studentId')
    const groupId = request.input('groupId')
    const endorseBy = request.input('endorseBy')
    const confirm = request.input('approved')
    console.log('Test Id: '+groupId +'Test confirm val: '+confirm)
    const desc = request.input('description')
    const groupControl = yield Database.select('coordinator')
    .from('group_controls').where('groupId', groupId)
    const gcJson = JSON.stringify(groupControl)
    const gcParse = JSON.parse(gcJson)
    yield Endorse.query().where('id', eId).update({confirmed: confirm, confirmDate: dateConfirm})
    //Insert New Updated Proposal
    if(confirm <= 0)
    {
      return response.redirect('/adviserDashboard')
    }
    else
    {
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
      return response.redirect('/adviserDashboard')

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

  * read (request, response, next ){
		const notifyId = request.param(0)
		yield Notification.query().where('id', notifyId).update({statusAdviser: 1})
		console.log("Notify category: " +notifyId)
		yield response.redirect('back')
	}

  * updateMust (request, response){
    var newDate = new Date()
    const user = yield request.auth.getUser()
    const workId = request.input('workId')
		const desc = request.input('descWbs')
		const status = request.input('status')
		const start = request.input('startDate')
		const end = request.input('endDate')
		const affectedRows = yield Database.select('*').from('workbreakdowns')
		.where('workId', request.input('workId')).update({ description: desc, status: status, startdate: start,
      enddate: end, email:user.email, updated_at: newDate})
		yield response.redirect('/adviserDashboard')
  }


  * updateReq(request, response){
    yield Requirement.query().where({id: request.input('workId')}).update({deadline: request.input('deadline')})
    return response.redirect('/adviserDashboard')
  }

}

module.exports = AdviserController

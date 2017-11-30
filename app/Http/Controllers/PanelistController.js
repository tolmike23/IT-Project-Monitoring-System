'use strict'
const Database = use('Database')
const Panelist = use('App/Model/Panelist')
const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Project')
const Notification = use('App/Model/Notification')

class PanelistController {

  * index(request, response) {
    //User
    const user = yield request.auth.getUser()

    //Project View
    const projects = yield Database.select('g.groupName', 'p.projectname', 'p.created_at','p.status','p.notes', 'p.id','p.groupId')
    .from('projects as p')
    .innerJoin('group_controls as g','p.groupId','g.groupId')
    .where('g.panelist',user.email)

    //Project Requirements
    const requirements = yield Database.select('r.projectId','r.must_have','r.deadline')
    .from('requirements as r')
    .innerJoin('group_controls as g', 'r.groupId', 'g.groupId')
    .where('g.panelist',user.email)

    //Group List View
    const groupList = yield Database.select('gc.groupId','gc.groupName','g.email', 'gc.chairman', 'gc.adviser', 'gc.coordinator')
    .from('group_controls as gc')
    .innerJoin('groups as g', 'gc.groupId', 'g.groupId')
    .where('gc.panelist', user.email)

    //Notification Data
    const panelistNotification = yield Database.select('n.groupId','n.category','n.id','g.groupName')
    .from('notifications as n')
    .innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.panelist',user.email)
    .where('n.statusPanelist', 0)

    //Notification Counter
    const panelist = yield Database.select('n.groupId','n.category')
    .from('notifications as n')
    .innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.panelist',user.email)
    .where('n.statusPanelist', 0).count('* as counter')
    const counter = JSON.parse(JSON.stringify(panelist))
    const panelistCounter = counter[0].counter

    const wbs = yield yield Database.select('m.groupId','g.groupName', 'm.workId', 'm.description', 'm.status','m.startdate','m.enddate','m.email','m.updated_at')
    .from('workbreakdowns as m')
    .innerJoin('group_controls as g','m.groupId','g.groupId')
    .where('g.panelist',user.email)


    yield response.sendView('panelistDashboard',{projects, groupList, panelistNotification, panelistCounter, requirements, wbs})
  }

  * read (request, response){
    const notifyId = request.param(0)
    yield Notification.query().where('id', notifyId).update({statusPanelist: 1})
    console.log("Notify category: " +notifyId)
    yield response.redirect('back')
  }

  * updateReq(request, response){
    yield Database.select('*').from('requirements').where({id: request.input('workId')}).update({deadline: request.input('deadline')})
    return response.redirect('/panelistDashboard')
  }
}

module.exports = PanelistController

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
    const projects = yield Database.select('g.groupName', 'p.projectname','p.created_at','p.status', 'p.notes').from('projects as p')
    .innerJoin('group_controls as g','p.groupId','g.groupId').where('g.panelist',user.email)

    //Group List View
    const groupList = yield Database.select('gc.groupId','gc.groupName','g.email', 'gc.chairman', 'gc.adviser', 'gc.coordinator').from('group_controls as gc')
    .innerJoin('groups as g', 'gc.groupId', 'g.groupId').where('gc.panelist', user.email)

    //Notification Data
    const panelistNotification = yield Database.select('n.groupId','n.category','n.id','g.groupName').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.panelist',user.email).where('n.statusPanelist', 0)

    //Notification Counter
    const panelist = yield Database.select('n.groupId','n.category').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.panelist',user.email).where('n.statusPanelist', 0).count('* as counter')
    const counter = JSON.parse(JSON.stringify(panelist))
    const panelistCounter = counter[0].counter
    console.log("How Many Notification "+ panelistCounter)

    yield response.sendView('panelistDashboard',{projects,groupList,panelistNotification,panelistCounter})
  }

  * read (request, response){
    const notifyId = request.param(0)
    yield Notification.query().where('id', notifyId).update({statusPanelist: 1})
    console.log("Notify category: " +notifyId)
    yield response.redirect('back')
  }
}

module.exports = PanelistController

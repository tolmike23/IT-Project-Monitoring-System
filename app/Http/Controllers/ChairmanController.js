'use strict'
const Database = use('Database')
const Notification = use('App/Model/Notification')
class ChairmanController {
  * index(request, response) {
    //User
    const user = yield request.auth.getUser()
    //Project View
    const projects = yield Database.select('g.groupName', 'p.projectname','p.created_at','p.status', 'p.notes').from('projects as p')
    .innerJoin('group_controls as g','p.groupId','g.groupId').where('g.chairman',user.email)

    //Notification Data
    const chairmanNotification = yield Database.select('n.groupId','n.category','n.id', 'g.groupName').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.chairman',user.email).where('n.statusChairman', 0)

    //Notification Counter
    const chairman = yield Database.select('n.groupId','n.category').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.chairman',user.email).where('n.statusChairman', 0).count('* as counter')
    const counter = JSON.parse(JSON.stringify(chairman))
    const chairmanCounter = counter[0].counter
    console.log("How Many Notification "+ chairmanCounter)


    yield response.sendView('chairmanDashboard',{projects,chairmanNotification,chairmanCounter})
  }

  * read (request, response){
    const notifyId = request.param(0)
    yield Notification.query().where('id', notifyId).update({statusChairman: 1})
    console.log("Notify category: " +notifyId)
    yield response.redirect('back')
  }
}

module.exports = ChairmanController

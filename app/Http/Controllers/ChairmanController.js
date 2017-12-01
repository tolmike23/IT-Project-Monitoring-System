'use strict'
const Database = use('Database')
const Notification = use('App/Model/Notification')
class ChairmanController {
  * index(request, response) {
    //User
    const user = yield request.auth.getUser()
    //Notification Data
    const chairmanNotification = yield Database.select('n.groupId','n.category','n.id', 'g.groupName').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.chairman',user.email).where('n.statusChairman', 0)

    //Notification Counter
    const chairman = yield Database.select('n.groupId','n.category').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
    .where('g.chairman',user.email).where('n.statusChairman', 0).count('* as counter')
    const counter = JSON.parse(JSON.stringify(chairman))
    const chairmanCounter = counter[0].counter

    //Project View
    const projects = yield Database.select('g.groupName', 'p.projectname', 'p.created_at','p.status','p.notes', 'p.id','p.groupId')
    .from('projects as p')
    .innerJoin('group_controls as g','p.groupId','g.groupId')
    .where('g.chairman',user.email)

    //Project Requirements
    const requirements = yield Database.select('r.projectId','r.must_have','r.deadline')
    .from('requirements as r')
    .innerJoin('group_controls as g', 'r.groupId', 'g.groupId')
    .where('g.chairman',user.email)

    const wbs = yield yield Database.select('g.groupId','g.groupName', 'm.workId', 'm.description', 'm.status','m.startdate','m.enddate','m.email','m.updated_at')
    .from('workbreakdowns as m')
    .innerJoin('group_controls as g','m.groupId','g.groupId')
    .where('g.chairman',user.email)

    //Group List View
    const groupList = yield Database.select('gc.groupId','gc.groupName', 'gc.chairman', 'gc.adviser', 'gc.coordinator')
    .from('group_controls as gc')
    .where('gc.chairman', user.email)

    //Groups Tables
    const groups = yield Database.from('groups')

    yield response.sendView('chairmanDashboard',{projects, chairmanNotification, chairmanCounter, requirements, wbs, groupList, groups})
  }

  * read (request, response){
    const notifyId = request.param(0)
    yield Notification.query().where('id', notifyId).update({statusChairman: 1})
    console.log("Notify category: " +notifyId)
    yield response.redirect('back')
  }

  * updateReq(request, response){
    yield Database.select('*').from('requirements').where({id: request.input('workId')}).update({deadline: request.input('deadline')})
    return response.redirect('/chairmanDashboard')
  }
}

module.exports = ChairmanController

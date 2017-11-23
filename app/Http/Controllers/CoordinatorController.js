'use strict'
const Database = use('Database')
const Endorse = use('App/Model/Endorse')
const GroupControl = use('App/Model/GroupControl')
const Notification = use('App/Model/Notification')
const Project = use('App/Model/Project')
const Requirement = use('App/Model/Requirement')

class CoordinatorController {
    * showCoordinator (request, response){
        const user = yield request.auth.getUser()
        const projects = yield Database.select('g.groupName', 'p.id', 'p.projectname','p.groupId').from('projects as p')
        .innerJoin('group_controls as g','p.groupId', 'g.groupId').where('p.coordinator',user.email)
        const requirements = yield Requirement.query().innerJoin('projects','requirements.projectId', 'projects.id').where('projects.coordinator', user.email).fetch()

        //const endorse = yield Endorse.query().where({endorseTo : user.email, //endorseType: 'Endorse to Coordinator'}).fetch()

        const endorse = yield Database.from('endorses').whereRaw('endorseType != ?', ['Proposal']).whereRaw('endorseTo = ?', [user.email])

        const gc = yield GroupControl.query().where({coordinator: user.email}).fetch()
        const gcMax = yield GroupControl.query().max('groupId as maxId')
        const gcMaxStringfy = JSON.stringify(gcMax)
        const gcMaxParse = JSON.parse(gcMaxStringfy)
        const maxId = gcMaxParse[0].maxId + 1

        //Notification Data
        const coordinatorCounter = yield Database.select('n.groupId','n.category').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
        .where('g.coordinator',user.email).where('n.statusCoordinator', 0)

        //Notification Counter
        const helo = yield Database.select('n.groupId','n.category').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
        .where('g.coordinator',user.email).where('n.statusChairman', 0).count('* as counter')
        const counter = JSON.parse(JSON.stringify(helo))
        const cordCounter = counter[0].counter

        yield response.sendView('coordinatorDashboard', {endorse:endorse, gc:gc.toJSON(), maxId,
          projects, requirements:requirements.toJSON(), coordinatorCounter, cordCounter})
    }

    * createGroup(request,response){
      try {
        const user = yield request.auth.getUser()
        const gc = new GroupControl()
        console.log("Group Id Value "+request.input('groupId'))
        gc.groupId = request.input('groupId')
        gc.groupName = request.input('groupName')
        gc.clSched = request.input('startTime')+"-"+request.input('endTime')+" "+request.input('days')
        gc.groupKey = request.input('groupKey')
        gc.coordinator = user.email
        gc.adviser = request.input('adviser')
        gc.chairman = request.input('chairman')
        gc.panelist = request.input('panelist')
        yield gc.save()
        yield request.with({ success: "Group Successfully Created" }).flash()
        return response.redirect('back')

      } catch (e) {
        console.log("Error Inserting Groups " + e.stack)
        yield request.with({ error: "Group Key Must Be Unique " }).flash()
  			return response.redirect('back')
      }

    }

    * createProject(request,response){
      try {
        const user = yield request.auth.getUser()
        const proj = new Project()
        proj.projectName = request.input('projectName')
        proj.coordinator = user.email
        proj.groupId = request.input('groupId')
        yield proj.save()
        yield request.with({ success: "Project Successfully Created" }).flash()
        return response.redirect('back')

      } catch (e) {
        console.log("Project Insert Error" + e.stack)
        return response.redirect('back')
      }
    }

    * insertReq(request,response){
      try {
        const require = new Requirement()
        require.projectId = request.input('pid')
        require.must_have = request.input('must')
        require.deadline = request.input('deadline')
        console.log("Deadline: "+request.input('deadline'))
        yield require.save()
        return response.redirect('/coordinatorDashboard')

      } catch (e) {
        console.log("Error Insert Requirements "+e.stack)
        return response.redirect('back')
      }
    }

}

module.exports = CoordinatorController

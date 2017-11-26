'use strict'
const Database = use('Database')
const Endorse = use('App/Model/Endorse')
const GroupControl = use('App/Model/GroupControl')
const Notification = use('App/Model/Notification')
const Project = use('App/Model/Project')
const Requirement = use('App/Model/Requirement')
const Rating = use('App/Model/Rating')

class CoordinatorController {
    * showCoordinator (request, response){

        const user = yield request.auth.getUser()

        const projects = yield Database.select('g.groupName', 'p.id', 'p.projectname','p.groupId').from('projects as p')
        .innerJoin('group_controls as g','p.groupId', 'g.groupId').where('p.coordinator', user.email)

        const requirements = yield Database.select('p.projectname','r.id', 'r.must_have', 'r.deadline')
        .from('requirements as r')
        .innerJoin('projects as p','r.projectId', 'p.id').where('p.coordinator', user.email)

        const endorse = yield Database.from('endorses').whereRaw('endorseType != ?', ['Proposal']).whereRaw('endorseTo = ?', [user.email])

        const gc = yield GroupControl.query().where({coordinator: user.email, statusCoordinator: 0}).fetch()

        const gcMax = yield GroupControl.query().max('groupId as maxId')
        const gcMaxStringfy = JSON.stringify(gcMax)
        const gcMaxParse = JSON.parse(gcMaxStringfy)
        const maxId = gcMaxParse[0].maxId + 1


        //Notification Data
        const coordinatorCounter = yield Database.select('n.groupId','n.category','n.id')
        .from('notifications as n')
        .innerJoin('group_controls as g','n.groupId','g.groupId')
        .where('g.coordinator',user.email).where('n.statusCoordinator', 0)

        //Notification Counter
        const helo = yield Database.select('n.groupId','n.category').from('notifications as n').innerJoin('group_controls as g','n.groupId','g.groupId')
        .where('g.coordinator',user.email).where('n.statusCoordinator', 0).count('* as counter')
        const counter = JSON.parse(JSON.stringify(helo))
        const cordCounter = counter[0].counter

        //Work Break Down Structure
        const wbs = yield yield Database.select('g.groupName', 'm.workId', 'm.description', 'm.status','m.startdate','m.enddate','m.email','m.updated_at').from('workbreakdowns as m')
        .innerJoin('group_controls as g','m.groupId','g.groupId').where('g.coordinator',user.email)

        const rating = yield Rating.query().where('createdBy', user.email).fetch()

        const users = yield Database.select('*').from('users').where({type: 'F'}).whereNot({email: user.email})

        yield response.sendView('coordinatorDashboard', {endorse:endorse, gc:gc.toJSON(), maxId,
          projects, requirements, coordinatorCounter, cordCounter, wbs,
          rating:rating.toJSON(), users})
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
        yield GroupControl.query().where({groupId: request.input('groupId')}).update({statusCoordinator:1})
        yield request.with({ success: "Project Successfully Created" }).flash()
        return response.redirect('back')

      } catch (e) {
        console.log("Project Insert Error" + e.stack)
        return response.redirect('back')
      }
    }

    * read (request, response, next ){
  		const notifyId = request.param(0)
  		yield Notification.query().where('id', notifyId).update({statusCoordinator: 1})
  		console.log("Notify category: " +notifyId)
  		yield response.redirect('back')
  	}

    * insertReq(request,response){
      try {
        const require = new Requirement()
        require.projectId = request.input('pid')
        require.must_have = request.input('must')
        require.deadline = request.input('deadline')
        require.groupId = request.input('gid')
        yield require.save()
        return response.redirect('/coordinatorDashboard')

      } catch (e) {
        console.log("Error Insert Requirements "+e.stack)
        return response.redirect('back')
      }
    }

    * insertRating (request, response){
        try {
            const user = yield request.auth.getUser()
            const rating = new Rating()
            rating.projectId = request.input('pid')
            rating.criteria = request.input('criteria')
            rating.score = request.input('avgScore')
            rating.createdBy = user.email
            rating.comments = request.input('remarks')
            yield rating.save()
            return response.redirect('/coordinatorDashboard')

        } catch (e) {
            console.log('Error creating in rating'+e.stack)
            return response.redirect('back')
        }
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
  		yield response.redirect('/coordinatorDashboard')
    }

    * updateReq(request, response){
      yield Requirement.query().update({deadline: request.input('deadline'), must_have: request.input('msh')})
      return response.redirect('/coordinatorDashboard')
    }

}

module.exports = CoordinatorController

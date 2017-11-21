'use strict'
const Endorse = use('App/Model/Endorse')
const GroupControl = use('App/Model/GroupControl')
class CoordinatorController {
    * showCoordinator (request, response){
        const user = yield request.auth.getUser()
        const endorse = yield Endorse.query().where({endorseTo : user.email, endorseType: 'Endorse to Coordinator'}).fetch()
        const gc = yield GroupControl.query().where({coordinator: user.email}).fetch()
        const gcMax = yield GroupControl.query().max('groupId as maxId')
        const gcMaxStringfy = JSON.stringify(gcMax)
        const gcMaxParse = JSON.parse(gcMaxStringfy)
        const maxId = gcMaxParse[0].maxId + 1
        yield response.sendView('coordinatorDashboard', {endorse:endorse.toJSON(), gc:gc.toJSON(), maxId})
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
        yield gc.save()
        yield request.with({ success: "Group Successfully Created" }).flash()
        return response.redirect('back')

      } catch (e) {
        console.log("Error Inserting Groups " + e.stack)
        yield request.with({ error: "Group Key Must Be Unique " }).flash()
  			return response.redirect('back')
      }

    }

}

module.exports = CoordinatorController

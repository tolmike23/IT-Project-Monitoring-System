'use strict'

const Endorse = use('App/Model/Endorse')
const GroupControl = use('App/Model/GroupControl')
class CoordinatorController {
    * showCoordinator (request, response){
        const user = yield request.auth.getUser()

        const endorse = yield Endorse.query()
                            .where({endorseTo : user.email, endorseType: 'Endorse to Coordinator'}).fetch()
        yield response.sendView('coordinatorDashboard', {endorse:endorse.toJSON()})
    }

    * createGroup(request,response){
      try {
        const user = yield request.auth.getUser()
        const gc = new GroupControl()
        gc.groupId = request.input('groupId')
        gc.groupName = request.input('groupName')
        gc.clSched = request.input('clSched')
        gc.groupKey = request.input('groupKey')
        gc.coordinator = user.email
        gc.adviser = request.input('adviser')
        gc.chairman = request.input('chairman')
        yield gc.save()
        return response.redirect('back')

      } catch (e) {
        console.log("Error: " + e.message)
        yield response.sendView('coordinatorDashboard', {createMessage: "Group Key Already Exist"})
      }

    }

}

module.exports = CoordinatorController

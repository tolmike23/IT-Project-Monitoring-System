'use strict'

const Endorse = use('App/Model/Endorse')
const GroupControl = use('App/Model/GroupControl')
const Notification = use('App/Model/Notification')

class CoordinatorController {
    * showCoordinator (request, response){
        const user = yield request.auth.getUser()

        const endorse = yield Endorse.query().where({endorseTo : user.email}).fetch()

        const gc = yield GroupControl.query().where({coordinator: user.email}).fetch()

        yield response.sendView('coordinatorDashboard', {endorse:endorse.toJSON(), gc:gc.toJSON()})
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
        yield request.with({ success: "Group Successfully Created" }).flash()
        return response.redirect('back')

      } catch (e) {
        yield request.with({ error: "Group Key Already Exists" }).flash()
  			return response.redirect('back')
      }

    }




/*
 * edit (request, response){
    console.log('Editing proposal..ID :'+request.input('id')+' Group ID : '+request.input('groupId'))
    const endorse = yield Endorse.query().where('id', request.input('id')).fetch()

    yield response.sendView('editEndorse', {proposal:endorse.toJSON()})
  }

* updateProposal (request, response){
    console.log('Updating proposal..ID : '+request.input('id')+' Group : '+request.input('groupId'))

    const endorse = yield Endorse.query().where('id', request.input('id')).update({
        description: request.input('description'),
  		  endorseType: request.input('endorseType'),
  		  notes: request.input('notes'),
  		  updated_at: Date.now()
    })


    yield response.redirect('/dashboard')

  }
 */



}

module.exports = CoordinatorController

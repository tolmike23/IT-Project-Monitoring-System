'use strict'
const Endorse = use('App/Model/Endorse')
const Group = use('App/Model/Group')
const GroupControl = use('App/Model/GroupControl')
const Projects = use('App/Model/Project')
const Requirements = use('App/Model/Requirement')
const Notification = use('App/Model/Notification')
class EndorseController {


 * submitProposal (request, response){
        const endorse = new Endorse()
        const user = yield request.auth.getUser()
        const groupId = request.input('groupId')
        endorse.groupId = groupId
        endorse.studentId = user.id
        endorse.endorseBy = user.email
        endorse.description = request.input('description')
        endorse.endorseType = request.input('endorseType')
        endorse.endorseTo = request.input('endorseTo')
        endorse.notes = request.input('notes')
        yield endorse.save()

        return response.redirect('/dashboard')

        // const endo = yield Endorse.query().where('studentId', groupId).fetch()
        // const group = yield Group.query().where('groupId', groupId).fetch()
        // const projects = yield Projects.query().where('groupId',groupId).fetch()
        // const groupControl = yield GroupControl.query().where('groupId', groupId).fetch()
        //
        // yield response.sendView('dashboard', {endorse:endo.toJSON(), group:group.toJSON(),

    }

 // * edit (request, response){
 //    console.log('Editing proposal..ID :'+request.input('id')+' Group ID : '+request.input('groupId'))
 //    const endorse = yield Endorse.query().where('id', request.input('id')).fetch()
 //
 //    yield response.sendView('editEndorse', {proposal:endorse.toJSON()})
 //  }

* updateProposal (request, response){
    console.log('Updating proposal..ID : '+request.input('id')+' Group : '+request.input('groupId'))

    const endorse = yield Endorse.query().where('id', request.input('id')).update({
        description: request.input('description'),
  		  notes: request.input('notes'),
  		  updated_at: Date.now()
    })
    /*
  	const endorse = yield Endorse.findOrCreate(
  		{ id: request.input('id')},
  		{ description: request.input('description'),
  		  endorseType: request.input('endorseType'),
  		  notes: request.input('notes'),
  		  updated_at: Date.now()
  		 })
    */
    yield response.redirect('/dashboard')

  }

// newly added
    * submitEndorse (request, response){
        console.log('deadline '+request.input('deadline'))
        const user = yield request.auth.getUser()
        const endorse = new Endorse()
        const groupId = request.input('groupId')
        const desc = request.input('description')
        const endorseType = request.input('endorseType')
        const endorseBy = user.email
        const endorseTo = request.input('endorseTo')
        endorse.groupId = groupId
        endorse.studentId = user.id
        endorse.endorseBy = endorseBy
        endorse.description = desc
        endorse.endorseType = endorseType
        endorse.endorseTo = endorseBy    // previous variable: endorseTo
        endorse.notes = request.input('notes')
        endorse.confirmed = 1
        endorse.confirmDate = request.input('deadline')
        yield endorse.save()

        const notify = new Notification()
        notify.groupId = groupId
        notify.comment = desc
        notify.category = endorseType
        notify.email = endorseBy
        yield notify.save()

        /*
        const projects = yield Projects.query().where('coordinator', endorseBy).fetch()
        const gc = yield GroupControl.query().where('coordinator', endorseBy).fetch()
        const endorses = yield Endorse.query().where('endorseTo', endorseTo).fetch()

        yield response.sendView('coordinatorDashboard', {endorse:endorses.toJSON(), projects:projects.toJSON(), gc:gc.toJSON(), user:true})
        */

        return response.redirect('/coordinatorDashboard')

    }

}

module.exports = EndorseController

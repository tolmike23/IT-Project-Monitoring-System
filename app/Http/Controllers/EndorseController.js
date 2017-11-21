'use strict'
const Endorse = use('App/Model/Endorse')
const Group = use('App/Model/Group')
const GroupControl = use('App/Model/GroupControl')
const Projects = use('App/Model/Project')
const Requirements = use('App/Model/Requirement')

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

        const endo = yield Endorse.query().where('studentId', groupId).fetch()
        const group = yield Group.query().where('groupId', groupId).fetch()
        const projects = yield Projects.query().where('groupId',groupId).fetch()
        const groupControl = yield GroupControl.query().where('groupId', groupId).fetch()

        yield response.sendView('dashboard', {endorse:endo.toJSON(), group:group.toJSON(), projects:projects.toJSON(), groupControl:groupControl.toJSON(), user:true})
    }

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

        const projects = yield Projects.query().where('adviser', endorseBy).fetch()
        const gc = yield GroupControl.query().where('coordinator', endorseBy).fetch()
        const endorses = yield Endorse.query().where({endorseBy: endorseBy, endorseTo:endorseTo}).fetch()

        yield response.sendView('oordinatorDashboard', {endorse:endorses.toJSON(), projects:projects.toJSON(), gc:gc.toJSON(), user:true})
    }

}

module.exports = EndorseController

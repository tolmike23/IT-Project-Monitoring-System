'use strict'

const Database = use('Database')
const Group = use('App/Model/Group')
const GroupControl = use('App/Model/GroupControl')
const Endorse = use('App/Model/Endorse')
const Projects = use('App/Model/Project')
const Requirements = use('App/Model/Requirement')

class GroupController {

	* show(request, response){
    const user = yield request.auth.getUser()
		const group = yield Group.query().where('email', user.email).fetch()
		yield response.sendView('dashboard', {group:group.toJSON()})
	}

	* join (request, response){
        const user = yield request.auth.getUser()
        const groupKey = request.input('groupKey')
        const groupId = request.input('groupControl')
            console.log("ID pick: "+ groupId)
            console.log("ID pick: "+ groupKey)
        const grpExist = yield GroupControl.query().where({groupKey: groupKey, groupId:groupId}).fetch()
        const grpLen = JSON.stringify(grpExist)
        const grp = JSON.parse(grpLen)

        if (grp.length <= 0){
                const groupControl = yield GroupControl.query().fetch()
          yield response.sendView('dashboard', {user:false, grpKeyError: 'Invalid group key', groupControl:groupControl.toJSON()})
        }
        else
        {
            const grpMember = new Group()
            grpMember.groupId = groupId
            grpMember.email = user.email
            grpMember.firstname = user.firstname
            grpMember.lastname = user.lastname
            grpMember.middlename = user.middlename
            grpMember.status = "active"
            yield grpMember.save()

            /* Group data */
            const group = yield Group.query().where('groupId', request.input('groupControl')).fetch()

            /* Endorse data*/
            const endorse = yield Endorse.query().where('groupId', request.input('groupId')).fetch()

            yield response.sendView('dashboard', {group:group.toJSON(), endorse:endorse.toJSON(), user:true})
        }
    }

  * edit (request, response){
	/* get data */
	const group = yield Group.query().where('id', request.input('id')).fetch()
	const project = yield Projects.query().where('id', request.input('project')).fetch()
	const requirements = yield Requirements.query().where('projectId', request.input('project')).fetch()

    console.log('member '+JSON.stringify(group))
    yield response.sendView('editGroup', {group:group.toJSON()})

  }

  * post (request, response){
    const member = yield Group.findOrCreate(
    {
        id: request.input('id')
    },
    {
        firstname: request.input('firstname'),
        lastname: request.input('lastname'),
        status: request.input('status'),
        updated_at: Date.now()
    })

    console.log('Updating member '+request.input('firstname'))
    const group = yield Group.query().where('groupId', request.input('groupId')).fetch()
    const endorse = yield Endorse.query().where('groupId', request.input('groupId')).fetch()
    const requirements = yield Requirements.query().where('projectId', request.input('projectId')).fetch()

    yield response.sendView('dashboard', {group:group.toJSON(), endorse:endorse.toJSON(), requirements:requirements.toJSON(), user:true})
  }

}

module.exports = GroupController

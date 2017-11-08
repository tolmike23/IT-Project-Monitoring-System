'use strict'

const Database = use('Database')
const Group = use('App/Model/Group')
const GroupControl = use('App/Model/GroupControl')
const Endorse = use('App/Model/Endorse')
const Projects = use('App/Model/Projects')
const Requirements = use('App/Model/Requirement')

class GroupController {


	* show(request, response){

    const user = yield request.auth.getUser()
		const group = yield Group.query().where('email', user.email).fetch()
		yield response.sendView('dashboard', {group:group.toJSON()})
	}

	* join (request, response) {

        const user = yield request.auth.getUser()
        const groupControl = yield Database.select("*").from("GroupControl")
        const groupKey = request.input('groupKey')
        const groupId = request.input('groupControl')
				//dad's code groupControl
        // const grpExist = yield groupControl.query().where('groupKey', groupKey).fetch()

				//my test code
				const grpExist = yield Database.select("groupKey").from("GroupControl")

				const grpLen = JSON.stringify(grpExist)
        const grp = JSON.parse(grpLen)


        if (grp.length <= 0){
            yield response.sendView('dashboard', {user:false, grpKeyError: 'Invalid group key', groupControl:groupControl})
            response.redirect('back')
        }

		const grpMember = new Group()
		//grpMember.groupname = user.username
        grpMember.groupId = groupId
        grpMember.email = user.email
        grpMember.firstname = user.firstname
				grpMember.lastname = user.lastname
        grpMember.middlename = user.middlename
        grpMember.status = "active"

		//grpMember.projectid = request.input('project')
		yield grpMember.save()


		/* Group data */
		const group = yield Group.query().where('groupId', request.input('groupControl')).fetch()

	  /* Endorse data*/
		//dad's code Endorse
	  // const endorse = yield Endorse.query().where('groupId', request.input('groupId')).fetch()

		//my edit code for endorse
		const endorse = yield Database.select("*").from("endorse")

		//const project = yield Projects.query()
        //                            .where('id', //request.input('project')).fetch()
		//const requirements = yield Requirements.query()
        //                            .where('projectId', //request.input('project')).fetch()

		/* update Projects table */
        //const projectId = yield Projects.find(request.input('project'))
		//projectId.groupId = request.input('email')
		//yield projectId.save()

		//yield response.sendView('dashboard', {group:group.toJSON(), //endorse:endorse.toJSON(), project:project.toJSON(), //requirements:requirements.toJSON()})

		//Dad's Code
		// yield response.sendView('dashboard', {group:group.toJSON(), endorse:endorse.toJSON(), user:true})

		//my edit code for endorse
		yield response.sendView('dashboard', {user:true})
	}

    * edit (request, response){

		/* get data */
		const group = yield Group.query()
                                    .where('id', request.input('id')).fetch()
		const project = yield Projects.query()
                                    .where('id', request.input('project')).fetch()
		const requirements = yield Requirements.query()
                                    .where('projectId', request.input('project')).fetch()

    console.log('member '+JSON.stringify(group))
        yield response.sendView('editGroup', {group:group.toJSON()})

    }

    * post (request, response){

      const member = yield Group.findOrCreate(
            { id: request.input('id')},
            { firstname: request.input('firstname'),
              lastname: request.input('lastname'),
              status: request.input('status'),
              updated_at: Date.now()
            }
        )
        const group = yield Group.query().where('projectId', request.input('projectId')).fetch()
        const requirements = yield Requirements.query().where('projectId', request.input('projectId')).fetch()
        yield response.sendView('dashboard', {group:group.toJSON(), requirements:requirements.toJSON(), user:true})
    }

}

module.exports = GroupController

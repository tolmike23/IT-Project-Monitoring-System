'use strict'

const Database = use('Database')
const GroupControl = use('App/Model/GroupControl')
const Group = use('App/Model/Group')
const Projects = use('App/Model/Projects')
const Requirements = use('App/Model/Requirement')
const Endorse = use('App/Model/Endorse')

class DashboardController {
	/*
    * show (request, response) {
       const characters = {
         'Daenerys Targaryen' : 'Emilia Clarke',
         'Jon Snow'           : 'Kit Harington',
         'Arya Stark'         : 'Maisie Williams',
         'Melisandre'         : 'Carice van Houten',
         'Khal Drogo'         : 'Jason Momoa',
         'Tyrion Lannister'   : 'Peter Dinklage',
         'Ramsay Bolton'      : 'Iwan Rheon',
         'Petyr Baelish'      : 'Aidan Gillen',
         'Brienne of Tarth'   : 'Gwendoline Christie',
         'Lord Varys'         : 'Conleth Hill'
       }

       yield response.sendView('welcome',  { characters: characters })
    }*/

    
	* showGroup (request, response) {
		const user = yield request.auth.getUser()
		try {
			
			//const projects = yield Projects.query().where('groupId', user.email).fetch()
			//const availableProjects = yield Projects.query().whereNull('groupId').fetch()
			//const groupProjects = JSON.stringify(availableProjects)
			//const gpProjects = JSON.parse(groupProjects)

			console.log('Current User : '+user.email)
            
			//const projects = yield Projects.all()
            var prj = null
            const projects = yield Projects.query().where('groupId', user.email).fetch()

            //console.log('projects '+Object.keys(JSON.stringify(projects)).length)
            const prjGrp = Object.keys(JSON.stringify(projects)).length
            if (prjGrp > 2) {  // no project available 
                prj = projects
                //console.log('prj1 '+JSON.stringify(prj))
                
            }else {
                prj = yield Projects.query().where('groupId', "").fetch()
                //console.log('prj2 '+JSON.stringify(prj))
            }
			const group = yield Group.query().where('email', user.email).fetch()
			const grpStr = JSON.stringify(group)
			const grpCtr = JSON.parse(grpStr)
            var members = []
            for (var i=0; i<grpCtr.length; i++){
                var tempItem = grpCtr[i]
                members.push({
                    "row" : i,
                    "id": tempItem.id,
                    "groupName": tempItem.groupName,
                    "email": tempItem.email,
                    "firstname": tempItem.firstname,
                    "lastname": tempItem.lastname,
                    "status": tempItem.status,
                    "projectId": tempItem.projectId,
                    "created_at": tempItem.created_at,
                    "updated_at": tempItem.updated_at
                })
            }

            members = JSON.parse(JSON.stringify(members))
			if (grpCtr.length > 0){
                console.log('Group ID : '+grpCtr[0].groupId)
                const group = yield Group.query().where('groupId', grpCtr[0].groupId).fetch()
                //const groupControl = yield GroupControl.query().where('groupId', 
                //grpCtr[0].groupId).fetch()                
                const groupControl = yield Database.select("*").from("groupcontrol").where('groupId', grpCtr[0].groupId)
                
				const requirements = yield Requirements.query().where('projectId', grpCtr[0].projectId).fetch()
                const endorse = yield Endorse.query().where('studentId', grpCtr[0].groupId).fetch()
                
                yield response.sendView('dashboard', {group:group.toJSON(), groupControl:groupControl.toJSON(), projects:prj.toJSON(), requirements:requirements.toJSON(), endorse:endorse.toJSON(), user:true})
                
			} else {
                
                const groupControl = yield Database.select("*").from("groupcontrol")
                console.log('groupControl '+groupControl)
                //yield response.sendView('dashboard', {groupControl:groupControl, group:{}, projects:{}, requirements:{}, user:true})
                yield response.sendView('dashboard', {groupControl:groupControl, group:{}, projects:{}, endorse:{}, requirements:{}, user:false})
            }
			
		}
		catch (e) {
			console.log('Exception thrown from DashboardController: '+e.stack)
		}
	}
	
	* showAdviser (request, response){
		const user = yield request.auth.getUser()
		const projects = yield Projects.query().where('adviser', user.email).fetch()

		yield response.sendView('adviserDashboard', {projects:projects.toJSON(), user:false})
	}
    
    * submitProposal (request, response){
        const endorse = new Endorse()
        const user = yield request.auth.getUser()
        const groupId = request.input('groupId')
        endorse.studentId = groupId
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

}

module.exports = DashboardController

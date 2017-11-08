'use strict'
const Helpers = use('Helpers')
const Database = use('Database')
const GroupControl = use('App/Model/GroupControl')
const Upload = use('App/Model/Upload')
const Group = use('App/Model/Group')
const Projects = use('App/Model/Projects')
const Requirements = use('App/Model/Requirement')
const Workbreakdown = use('App/Model/Workbreakdown')
class DashboardController {

	//Fruitjam Upload file
	* store (request, response) {
			//get user
			const user = yield request.auth.getUser()

      //instantiate upload class Model
      const upload = new Upload()
      //User uploaded document
      const file = request.file('file', {
        maxSize: '1mb',
        allowedExtensions: ['png', 'jpg', 'docx', 'pdf', 'xlsx']
      })

      //Make User upload unique name
      const fileName = `${new Date().getTime()}.${file.extension()}`


      //store document in storage/upload file path.
      yield file.move('storage', fileName)
			//yield file.move(Helpers.storagePath(), fileName)

      //Check if the move was being interrupt
      if(!file.moved()){
        response.badRequest({error: file.errors()})
        return
      }
      //Uplaod path store to Upload Table(groupId and filepath)
      const filePath = file.uploadPath()
      console.log(filePath)
      upload.document = filePath
			upload.groupId = Database.select('groupId').from('groups').where('email', user.email)
      yield upload.save()

			return response.redirect('/dashboard')
	}

	//Fruitjam Download file
	* download (request, response) {
		try {
			const media = request.param(0)
			console.log("Media: "+ media)
			// yield response.header('Content-type', 'multipart/form-data')
			yield response.download(Helpers.storagePath(media))
			// return response.redirect('/dashboard')
		} catch (e) {
			yield response.sendView('dashboard', {
					downloadMessage: e.message
			})
		}

	}

	// //Fruitjam Work Break Down Structure Added
	* mustHave (request, response) {
		const user = yield request.auth.getUser()
		const wbsIn = new Workbreakdown()
    wbsIn.must_id = request.input('mustId')
    wbsIn.description = request.input('mustDesc')
	  wbsIn.email = user.email
    yield wbsIn.save()
		return response.redirect('/dashboard')
	}

	* showGroup (request, response) {
		const user = yield request.auth.getUser()
		try {

			console.log('Current User : '+user.email)

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
			if (grpCtr.length > 0)
			{
	      console.log('Group ID : '+grpCtr[0].groupId)
	      const group = yield Group.query().where('groupId', grpCtr[0].groupId).fetch()

	      //Dad's Code
	      // const groupControl = yield GroupControl.query().where('groupId', grpCtr[0].groupId).fetch()

	      //My Code Edit
	      const groupControl = yield Database.select('groupId').from('groupControl').where('groupId', grpCtr[0].groupId)


	      const requirements = yield Database.select('*').from('requirements').where('projectId', grpCtr[0].projectId)

	      //Dad's Code
	      // yield response.sendView('dashboard', {group:group.toJSON(), groupControl:groupControl.toJSON(), projects:prj.toJSON(), requirements:requirements.toJSON(), user:true})

	      // My Code Edit
				// get Upload table field
				const uploads = yield Database.select('*').from('uploads').where('groupId', grpCtr[0].groupId)

				//get Workbreakdowns table field
				const works = yield Database.select('*').from('workbreakdowns').where('email', user.email).orderBy('must_id', 'asc')

	      yield response.sendView('dashboard', {group:group.toJSON(), groupControl, projects:prj.toJSON(), requirements, works, uploads,	user:true})
			}
			else
			{
				const groupControl = yield Database.select("*").from("GroupControl")
				console.log('groupControl '+groupControl)
				//yield response.sendView('dashboard', {groupControl:groupControl, group:{}, projects:{}, requirements:{}, user:true})
				yield response.sendView('dashboard', {groupControl:groupControl, group:{}, endorse:{}, user:false})
			}

		}
		catch (e)
		{
			console.log('Exception thrown from DashboardController: '+e.stack)
		}
	}

	* showAdviser (request, response){
		const user = yield request.auth.getUser()
		const projects = yield Projects.query().where('adviser', user.email).fetch()

		yield response.sendView('adviserDashboard', {projects:projects.toJSON(), user:false})

	}

}

module.exports = DashboardController

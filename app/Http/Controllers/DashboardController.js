'use strict'

const Database = use('Database')
const GroupControl = use('App/Model/GroupControl')
const Group = use('App/Model/Group')
const Projects = use('App/Model/Projects')
const Requirements = use('App/Model/Requirement')
const Endorse = use('App/Model/Endorse')
const Upload = use('App/Model/Upload')
const Helpers = use('Helpers')
const Workbreakdown = use('App/Model/Workbreakdown')
const Notification = use('App/Model/Notification')

class DashboardController {

	//Fruitjam Upload file
	* store (request, response) {
		//get user
		const user = yield request.auth.getUser()

		//instantiate upload class Model
		const upload = new Upload()
		//User uploaded document
		const file = request.file('file', {
		maxSize: '3mb',
		allowedExtensions: ['png', 'jpg', 'docx', 'pdf', 'xlsx']
		})

		//Make User upload unique name
		const fileName = `${new Date().getTime()}.${file.extension()}`

		//store document in storage/upload file path.
		yield file.move('storage', fileName)


		//Check if the move was being interrupt
		if(!file.moved()){
			return response.redirect('back')
		}
		//Upload path store to Upload Table(groupId and filepath)
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
			yield response.attachment(Helpers.storagePath(media))
			}
			catch (e) {
				yield response.sendView('dashboard', {downloadMessage: e.message})
		}

	}

	//Fruitjam Work Break Down Structure Added
	* mustHave (request, response) {
		const user = yield request.auth.getUser()
		const wbsIn = new Workbreakdown()
<<<<<<< HEAD

=======
>>>>>>> 0a691caa7cecc114a2e993fb0f37b9170fe215f9
		wbsIn.must_id = request.input('mustId')
		wbsIn.description = request.input('mustDesc')
		wbsIn.status = request.input('status')
		wbsIn.startdate = request.input('startDate')
		wbsIn.enddate = request.input('endDate')
		wbsIn.email = user.email
		yield wbsIn.save()
<<<<<<< HEAD

=======
>>>>>>> 0a691caa7cecc114a2e993fb0f37b9170fe215f9
		return response.redirect('/dashboard')
	}

	//Fruitjam Work Break Down Structure Edit Form
	* sendEditWbs (request, response) {
		const works = yield Database.select('*').from('workbreakdowns').where('workId', request.input('workId'))
		yield response.sendView('editWbs', {works})
	}

	//Fruitjam Work Break Down Structure Update
	* updateWbs (request, response) {
		const workId = request.input('workId')
		const desc = request.input('descWbs')
		const status = request.input('status')
		const start = request.input('startDate')
		const end = request.input('endDate')
		const affectedRows = yield Database.select('*').from('workbreakdowns')
		.where('workId', request.input('workId')).update({ description: desc, status: status, startdate: start, enddate: end})
		yield response.redirect('/dashboard')
	}
	//Fruitjam notifications
	* read (request, response, next ){
		const notifyId = request.param(0)
		yield Notification.query().where('id', notifyId).update({status: 'read'})
		console.log("Notify category: " +notifyId)
		yield response.redirect('back')
	}

	* showGroup (request, response) {
		const user = yield request.auth.getUser()
		try {

		console.log('Current User : '+user.email)
		var prj = null
		const projects = yield Projects.query().where('groupId', user.email).fetch()
		const prjGrp = Object.keys(JSON.stringify(projects)).length

		if (prjGrp > 2) {  // no project available
			prj = projects
		}
		else {
			prj = yield Projects.query().where('groupId', "").fetch()
		}
		const group = yield Group.query().where('email', user.email).fetch()
		const grpStr = JSON.stringify(group)
		const grpCtr = JSON.parse(grpStr)

		console.log('Group ID : '+grpCtr[0].groupId)
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
		console.log("members data: "+ members)
		if (grpCtr.length > 0){

		const group = yield Group.query().where('groupId', grpCtr[0].groupId).fetch()

		const groupControl = yield GroupControl.query().where('groupId', grpCtr[0].groupId)

		const endorse = yield Endorse.query().where('studentId', grpCtr[0].groupId).fetch()

		const requirements =  yield Requirements.query().where('projectId', grpCtr[0].groupId).fetch()

		// get Upload table data
		const uploads = yield Database.select('*').from('uploads').where('groupId', grpCtr[0].groupId)

		//get Workbreakdowns data
		const works = yield Database.select('*').from('workbreakdowns').where('email', user.email).orderBy('must_id', 'asc')

		//count notification data for group
		const notifyGroup = yield Database.select('*').from('notifications').where({category: 'Group', status:'unread'}).count('* as counter')
		const jsonNotify = JSON.stringify(notifyGroup)
		const notifyCounter = JSON.parse(jsonNotify)

		//count notification data for All
		const notifyAll = yield Database.select('*').from('notifications').where({category: 'All', status:'unread'}).count('* as counter')
		const jsonNotifyAll = JSON.stringify(notifyAll)
		const notifyCounterAll = JSON.parse(jsonNotifyAll)

		// workbreakdowns end date
		const jsonDate = JSON.stringify(works)
		const endDate = JSON.parse(jsonDate)
		var counter = 0 // How many due within 7 days
		var jsonObjWbs = []
		for(var i=0; i<endDate.length; i++){
			var end =  endDate[i].enddate // end date data from wbs
			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var firstDate = new Date()//Today date
			var secondDate = new Date(end)//enddates
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))) // Date Difference
			console.log("End Dates diff from Today Date: "+diffDays)
			//Check wbs end date if its due within 7 days
			if(diffDays <= 1){
				 counter++
				 console.log("Counter: "+counter)
				 var tempData = endDate[i]
				 jsonObjWbs.push({
					 	"description" : tempData.description,
						"id" : tempData.workId
				 })

			}
		}

		//Print the Necessary Values for WBS date comparison
		jsonObjWbs = JSON.parse(JSON.stringify(jsonObjWbs))

		//Notification Total Counter
		const notifyGroupNotifyCounter = notifyCounter[0].counter + notifyCounterAll[0].counter

		console.log("Notification Total Counter FOR Coordinator: "+notifyGroupNotifyCounter)
		console.log("Notification Total Counter FOR Wbs: "+counter)

		//Fetch notification data for All & Group
		const fetchNotify = yield Database.select('*').from('notifications').whereNot({category: 'Faculty', status:'read'})

		yield response.sendView('dashboard', {group:group.toJSON(), projects:projects.toJSON(),
				groupControl, endorse:endorse.toJSON(), requirements:requirements.toJSON(),
				notifyGroupNotifyCounter,fetchNotify,counter,jsonObjWbs,works, uploads, user:true})
		}
		else
		{
			const groupControl = yield GroupControl.query().fetch()
			console.log('groupControl '+groupControl)
			yield response.sendView('dashboard', {groupControl:groupControl.toJSON(),user:false})
		}
		} catch (e) {
			console.log('Exception thrown from DashboardController: '+e.stack)
		}
	}

	* showAdviser (request, response){
		const user = yield request.auth.getUser()
		const projects = yield Projects.query().where('adviser', user.email).fetch()

		yield response.sendView('adviserDashboard', {projects:projects.toJSON(), user:false})
	}
<<<<<<< HEAD

	
=======
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
>>>>>>> 0a691caa7cecc114a2e993fb0f37b9170fe215f9

}

module.exports = DashboardController

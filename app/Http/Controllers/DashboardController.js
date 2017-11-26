'use strict'

const Database = use('Database')
const GroupControl = use('App/Model/GroupControl')
const Group = use('App/Model/Group')
const Projects = use('App/Model/Project')
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
		//today date JS
		const date = Date.now()
		const fileClientName = file.clientName()
		console.log("Client Name Now: "+ fileClientName)
		//Make User upload unique name
		const fileName = `${date}.${fileClientName}`

		//store document in storage/upload file path.
		yield file.move('storage', fileName)


		//Check if the move was being interrupt
		if(!file.moved()){
			// yield response.sendView('dashboard', {fileError : file.errors()})
			const errorMsg = file.errors()
			console.log(errorMsg)
			yield request.with({ error: errorMsg }).flash()
			return response.redirect('back')
		}
		//Upload path store to Upload Table(groupId and filepath)
		const filePath = file.uploadPath()
		console.log(filePath)
		upload.document = filePath
		upload.groupId = Database.select('groupId').from('groups').where('email', user.email)
		yield upload.save()
		yield request.with({ success: "Successfull Uploaded" }).flash()
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
		try {
			const user = yield request.auth.getUser()
			console.log('group ID: '+request.input('groupId'))
			const wbsIn = new Workbreakdown()
			// console.log('mustID: '+request.input('mustId'))
			wbsIn.must_id = request.input('mustId')
			wbsIn.description = request.input('mustDesc')
			wbsIn.status = request.input('status')
			wbsIn.startdate = request.input('startDate')
			wbsIn.enddate = request.input('endDate')
			wbsIn.groupId = request.input('groupId')
			wbsIn.email = user.email
			yield wbsIn.save()

			return response.redirect('/dashboard')

		} catch (e) {
			yield request.with({ error: e.message }).flash()
			return response.redirect('/dashboard')
		}

	}

	//Fruitjam Work Break Down Structure Update
	* updateWbs (request, response) {
	  var newDate = new Date()
		const user = yield request.auth.getUser()
		const workId = request.input('workId')
		const desc = request.input('descWbs')
		const status = request.input('status')
		const start = request.input('startDate')
		const end = request.input('endDate')
		const affectedRows = yield Database.select('*').from('workbreakdowns')
		.where('workId', request.input('workId')).update({description: desc, status: status,
			startdate: start, enddate: end, email:user.email, updated_at: newDate})
		yield response.redirect('/dashboard')
	}
	//Fruitjam notifications
	* read (request, response, next ){
		const notifyId = request.param(0)
		yield Notification.query().where('id', notifyId).update({statusGroup: 1})
		console.log("Notify category: " +notifyId)
		yield response.redirect('back')
	}

	* showGroup (request, response) {
		const user = yield request.auth.getUser()
		try {

            var prj = null

            const grp = yield Group.query().where('email', user.email).fetch()
            const grpStr = JSON.stringify(grp)
            console.log('grpStr '+grpStr)
            const grpCtr = JSON.parse(grpStr)

            //const projects = yield Projects.query().where('groupId', user.email).fetch()
            //const prjGrp = Object.keys(JSON.stringify(projects)).length

            /*
            if (prjGrp > 2) {  // no project available
                prj = projects
            }
            else {
                console.log('Way group')
                prj = yield Projects.query().where('groupId', "").fetch()
            }
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
            */

            if (grpCtr.length > 0){

                console.log('group '+grpCtr[0].groupId)
                const groupId = grpCtr[0].groupId
                const group = yield Group.query().where('groupId', groupId).fetch()
                console.log('Group '+JSON.stringify(group))

                const groupControl = yield GroupControl.query().where('groupId', groupId).fetch()
                console.log('Group Control '+JSON.stringify(groupControl))

                const endorse = yield Endorse.query().where('groupId', groupId).fetch()
                console.log('Endorse '+JSON.stringify(endorse))

                const requirements =  yield Requirements.query().where('projectId', groupId).fetch()
                console.log('Requirements '+JSON.stringify(requirements))

                const projects = yield Projects.query().where('groupId', groupId).fetch()
                console.log('Projects '+JSON.stringify(projects))

                // get Upload table data
                const uploads = yield Database.select('*').from('uploads').where('groupId', groupId)
                console.log('Uploads '+JSON.stringify(uploads))

                //get Workbreakdowns data
                const works = yield Database.select('*').from('workbreakdowns').where('groupId', groupId).orderBy('must_id', 'asc')
                console.log('Works '+JSON.stringify(works))

                //Fetch notification data for Group
                const fetchNotify = yield Database.select('*').from('notifications').where({groupId: groupId, statusGroup:0})
                console.log('fetchNotify '+JSON.stringify(fetchNotify))

                //count notification data for All
                const notifyAll = yield Database.select('*').from('notifications').where({groupId: groupId, statusGroup:0}).count('* as counter')
                console.log('notifyAll '+JSON.stringify(notifyAll))
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
                    if(diffDays <= 7){
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
                const notifyGroupNotifyCounter = notifyCounterAll[0].counter

                yield response.sendView('dashboard', {group:group.toJSON(), projects:projects.toJSON(),
                        groupControl:groupControl.toJSON(), endorse:endorse.toJSON(), requirements:requirements.toJSON(),
                        notifyGroupNotifyCounter, fetchNotify, counter, jsonObjWbs, works, uploads, user:true})

            }
            else
            {
                const groupControl = yield GroupControl.query().fetch()
                // console.log('groupControl '+groupControl)
                yield response.sendView('dashboard', {groupControl:groupControl.toJSON(), user:false})
            }
		} catch (e) {
			console.log('Exception thrown from DashboardController: '+e.stack)
		}
	}

    * facultyOpt (request, response){
        yield response.sendView('dashboardOptions')

    }

    * viewAs (request, response){
        const view = request.input('userType')
        if (view === 'A') return response.redirect('/adviserDashboard')
        if (view === 'C') return response.redirect('/coordinatorDashboard')
        if (view === 'P') return response.redirect('/panelistDashboard')
				if (view === 'H') return response.redirect('/chairmanDashboard')
    }

}

module.exports = DashboardController

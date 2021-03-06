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

            const grp = yield Group.query().where('email', user.email).fetch()
            const grpStr = JSON.stringify(grp)
            const grpCtr = JSON.parse(grpStr)

            if (grpCtr.length > 0) {

                const groupId = grpCtr[0].groupId
                const group = yield Group.query().where('groupId', groupId).fetch()

                const groupControl = yield GroupControl.query().where('groupId', groupId).fetch()


                const endorse = yield Endorse.query().where('groupId', groupId).fetch()


                const requirements =  yield Requirements.query().where('groupId', groupId).fetch()


                const projects = yield Projects.query().where('groupId', groupId).fetch()


                // get Upload table data
                const uploads = yield Database.select('*').from('uploads').where('groupId', groupId)


                //get Workbreakdowns data
                const works = yield Database.select('').from('workbreakdowns').where('groupId', groupId).orderBy('must_id', 'asc')

								//Work Break Down Populate
								const workMust = yield Database.select('r.id','w.must_id','r.must_have','w.description','w.status','w.startdate','w.enddate','w.email','w.updated_at')
								.from('workbreakdowns as w')
								.innerJoin('requirements as r', 'r.id', 'w.must_id')
								.where('w.groupId',groupId)
								console.log(JSON.stringify(workMust))

                //Fetch notification data for Group
                const fetchNotify = yield Database.select('*').from('notifications').where({groupId: groupId, statusGroup:0})

                //count notification data for All
                const notifyAll = yield Database.select('*').from('notifications').where({groupId: groupId, statusGroup:0}).count('* as counter')

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
                        notifyGroupNotifyCounter, fetchNotify, counter, jsonObjWbs, works,
												uploads, user:true, workMust})

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

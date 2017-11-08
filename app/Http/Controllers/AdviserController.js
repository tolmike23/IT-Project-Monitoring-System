'use strict'

const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Projects')
const Panelist = use('App/Model/Panelist')

class AdviserController {

    * list (request, response) {
       const advisers = {
         'Daenerys Targaryen' : 'Emilia Clarke',
         'Jon Snow'           : 'Kit Harington',
         'Arya Stark'         : 'Maisie Williams',
         'Melisandre'         : 'Carice van Houten',
         'Khal Drogo'         : 'Jason Momoa',
         'Tyrion Lannister'   : 'Peter Dinklage',
         'Ramsay Bolton'      : 'Iwan Rheon',
         'Petyr Baelish'      : 'Aidan Gillen',
         'Brienne of Tarth'   : 'Gwendoline Chri Adivser',
         'Lord Varys'         : 'Conleth Hill'
       }

       yield response.sendView('advisers',  { advisers: advisers })

    }

    * show (request, response) {
        const advisers = yield Advisers.all()
        const projects = yield Projects.all()
        const panelist = yield Panelist.all()
        //yield advisers.query().where('status','active').fetch()
		yield response.sendView('advisers', {advisers:advisers.toJSON(), projects:projects.toJSON(), panelist:panelist.toJSON()})
        
	}

	* call (request, response) {
		yield response.sendView('addAdviser')
	}

	* add (request, response) {
		const adviser = new Advisers()
		adviser.email = request.input("email")
		adviser.firstname = request.input("firstname")
		adviser.lastname = request.input("lastname")
        adviser.status = "active"
		adviser.role = request.input("role")
		yield adviser.save()

        const advisers = yield Advisers.all()
        yield response.sendView('advisers', {advisers:advisers.toJSON()} )

	}


    * edit (request, response){

    }

}

module.exports = AdviserController

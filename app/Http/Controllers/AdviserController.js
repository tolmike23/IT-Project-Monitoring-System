'use strict'

const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Projects')
const Panelist = use('App/Model/Panelist')
const Requirements = use('App/Model/Requirement')

class AdviserController {
  /*Adviser Show
    -Show Group Project Under This Adviser
    -Show Group Requirements Under This Adviser
  */
  // * show (request, response) {
  //   const user = yield request.auth.getUser()
  //   const project = yield Projects.query().where('adviser', user.email).fetch()
  //   const requirements = yield Requirements.query().where('projectId', project.id).fetch()
  //   console.log("Requirements")
  //   yield response.sendView('advisers', {project:project.toJSON(), requirements:requirements.toJSON()})
  // }

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

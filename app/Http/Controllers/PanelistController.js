'use strict'

const Panelist = use('App/Model/Panelist')
const Advisers = use('App/Model/Advisers')
const Projects = use('App/Model/Project')

class PanelistController {

  * index(request, response) {
    //
  }

  * create(request, response) {
    //
    const panel = new Panelist()
    panel.projectid = request.input("project")
    panel.email = request.input("adviser")
    panel.status = request.input("status")
    yield panel.save()

    const advisers = yield Advisers.all()
    const panelist = yield Panelist.all()
    const projects = yield Projects.all()
    yield response.sendView('advisers',{advisers:advisers.toJSON(), panelist:panelist.toJSON(), projects:projects.toJSON()})
 }

  * store(request, response) {
    //
  }

  * show(request, response) {
    //
    const panelist = yield Panelist.all()

  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    //
  }

  * destroy(request, response) {
    //
  }

}

module.exports = PanelistController

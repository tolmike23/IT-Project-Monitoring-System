'use strict'
const Endorse = use('App/Model/Endorse')

class EndorseController {
    
 * edit (request, response){
    const endorse = yield Endorse.query().where('groupId', request.input('projectId')).fetch()

    yield response.sendView('editEndorse', {proposal:endorse.toJSON()})
  }

}

module.exports = EndorseController

'use strict'

const Endorse = use('App/Model/Endorse')

class CoordinatorController {
    * showCoordinator (request, response){
        const user = yield request.auth.getUser()

        const endorse = yield Endorse.query()
                            .where({endorseTo : user.email, endorseType: 'Endorse to Coordinator'}).fetch()
        yield response.sendView('coordinatorDashboard', {endorse:endorse.toJSON()})
    }



}

module.exports = CoordinatorController

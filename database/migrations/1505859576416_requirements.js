'use strict'

const Schema = use('Schema')

class RequirementsTableSchema extends Schema {

  up () {
    this.create('requirements', (table) => {
      table.increments()
      table.integer('projectId').unsigned().notNullable()
        table.integer('groupId').notNullable()
      table.string('must_have',254).notNullable()
      table.integer('milestone')
	    table.string('deadline')
      table.string('notes',254)
      table.timestamps()
    })
  }

  down () {
    this.drop('requirements')
  }

}

module.exports = RequirementsTableSchema

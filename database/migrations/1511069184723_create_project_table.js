'use strict'

const Schema = use('Schema')

class ProjectsTableSchema extends Schema {

  up () {
    this.create('projects', (table) => {
      table.increments()
      table.string('projectname',120).notNullable()
      table.string('coordinator',254).notNullable()
      table.integer('groupId').unsigned()
      table.string('notes',254).notNullable()
      table.string('status',20)
      table.timestamps()
    })
  }

  down () {
    this.drop('projects')
  }

}

module.exports = ProjectsTableSchema

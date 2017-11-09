'use strict'

const Schema = use('Schema')

class AdvisersTableSchema extends Schema {

  up () {
    this.create('advisers', (table) => {
      table.increments()
      table.string('email',254).notNullable().unique()
      table.string('firstname',50).notNullable()
      table.string('lastname',50).notNullable()
      table.string('status',20).notNullable()
	    table.string('role',50).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('advisers')
  }

}

module.exports = AdvisersTableSchema

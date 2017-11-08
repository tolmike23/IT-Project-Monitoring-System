'use strict'

const Schema = use('Schema')

class UploadTableSchema extends Schema {

  up () {
    this.create('uploads', (table) => {
      table.increments('uploadId')
      table.integer('groupId').unsigned().notNullable();
      table.string('document', 150).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('uploads')
  }

}

module.exports = UploadTableSchema

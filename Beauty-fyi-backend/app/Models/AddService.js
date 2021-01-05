'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AddService extends Model {

  User () {
    return this.hasOne('App/Models/User')
  }

  ServiceAddon () {
    return this.hasMany('App/Models/ServiceAddon')
  }
  ServiceStep () {
    return this.hasMany('App/Models/ServiceStep')
  }

}

module.exports = AddService

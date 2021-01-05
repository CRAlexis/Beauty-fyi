'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  encryptionKey () {
    return this.hasMany('App/Models/Encryption')
  }

  userAttr () {
    return this.hasMany('App/Models/UserAttr')
  }

  UserMedia () {
    return this.hasMany('App/Models/UserMedia')
  }


  AddService () {
    return this.hasMany('App/Models/AddService')
  }
  ServiceAddon () {
    return this.hasMany('App/Models/ServiceAddon')
  }
  ServiceStep () {
    return this.hasMany('App/Models/ServiceStep')
  }

  StylistAddForm () {
    return this.hasMany('App/Models/StylistAddForm')
  }

  StylistForm () {
    return this.hasMany('App/Models/StylistForm')
  }

  ScheduleLimit () {
    return this.hasMany('App/Models/ScheduleLimit')
  }

  ScheduleAvailabilityDay () {
    return this.hasMany('App/Models/ScheduleAvailabilityDay')
  }

}

module.exports = User

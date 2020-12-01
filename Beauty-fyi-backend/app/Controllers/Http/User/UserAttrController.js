'use strict'

const User = use('App/Models/User')
const UserAttr = use('App/Models/UserAttr')

class UserAttrController {

  async addAttr({ request, auth, session, response }){
    const { userID, attr, value } = request.all()

    // retrieve user base on the form data
    const user = await User.query().where('email', email).where('is_active', true).first()
    const userID = user.id;


    //Check if Attr is in database and instead of adding a new column it should just be edited
    const userAttr = await UserAttr.query().where('attr', attr).where('user_id', userID).where('is_active', true).first()
    const userAttrID = userAttr.id;

    if(!userAttrID){//Row is not in database
      // Add Attr
      const userAttr =  await UserAttr.create({
        attr: attr,
        value: value,
        lastUpdated: moment().format('MM Do YYYY, h:mm:ss a')//moment.js
      })
    }else{//Row is in database
      // Edit Attr
      const UserAttr = await UserAttr.query().where('attr', attr).where('user_id', userID).update({'value' : value, 'lastUpdated' : moment().format('MM Do YYYY, h:mm:ss a')})
    }
  }

  async deleteAttr({ request, auth, session, response }){
    const { userID, attr, value } = request.all()

    // retrieve user base on the form data
    const user = await User.query().where('email', email).where('is_active', true).first()
    const userID = user.id;

    //Delete Attr
    const UserAttr = await UserAttr.query().where('attr', attr).where('user_id', userID).delete()
  }

}

module.exports = UserAttrController

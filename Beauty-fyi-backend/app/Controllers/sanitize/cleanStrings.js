
class cleanStrings {

  async cleanStrings( {variable, type} ){
    type = type.toLowerCase();
    //Sanitization Rules
    const sanitizationStringRules = {
      comment: 'escape',
      tweet: 'strip_tags'
    }
    const sanitizationEmailRules = {
      email: 'normalize_email'
    }

    if(type === "string"){
      return Validator.sanitize(variable, sanitizationStringRules)
    }
    if(type === "email"){
      return Validator.sanitize(variable, sanitizationEmailRules)
    }
  }

}

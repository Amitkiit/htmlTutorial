const validPassword=function (password){
    var regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return regex.test(password);
  }

  const validMobile=function (number){
    var regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
      return regex.test(number);
  }


  module.exports={validPassword,validMobile}
export const constants = {
  GYM_GIRL:  "GYM GIRL COMMUNITY",
  JOIN_THE_COMMUNITY:"Join the Community",
  START_YOUR_JOURNEY:"Start your transformation journey today",

}
export const  validatePassword = (password : string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    return strongPasswordRegex.test(password);
  };
  export const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
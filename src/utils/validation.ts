import { validateEmail, validatePassword } from "./commonConstants";
import { regex } from "./commonFunction";

export type LoginErrors = {email?: string, password?:string, agreedToterms? : string, fullName? : string};
export type LoginValidationResult = {isValid : boolean, errors : LoginErrors };


export const validateLoginForm = (email: string, password: string) :LoginValidationResult => {

  const errors  : LoginErrors={};

  if (!email.trim()) {
    errors.email = "Email is required";
  }
  else if (!regex.test(email)) {
    errors.email = "Enter valid email";
  }
  else {
    errors.email = "";
  }
  if (!(password).trim()) {
    errors.password = "Password is required";
  }
  return {isValid : !errors.email && !errors.password, errors};
}

export const validateSignupForm = ( email: string, password: string, fullName : string , agreedToTerms: boolean) :LoginValidationResult=> {
  const errors:LoginErrors = {};
  if (!email.trim()) {
    errors.email = "Email is required";
  }
  else if (!validateEmail(email)) {
    errors.email = "Please enter valid email";
  }
  else {
    errors.email = "";
  }
  if (!password.trim()) {
    errors.password = "Password is required";
  }
  else if (!validatePassword(password)) {
    errors.password = "Passwrod at least be 8 characters includig special character";
  }
  else {
    errors.password = "";
  }
  if(!fullName.trim()){
    errors.fullName = "Full name is required";
  }

if(!agreedToTerms){
  errors.agreedToterms = "Accept terms and condition";
}  
  return {isValid : !errors.email && !errors.password && !errors.fullName && !errors.agreedToterms, errors};
}
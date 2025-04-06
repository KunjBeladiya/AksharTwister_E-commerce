console.log("script runnung");

function validateForm() {
  let companyName = document.getElementById("company").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  let isValid = true;

  // Company Name Validation
  if (companyName === "") {
    document.getElementById("companyError").innerText =
      "Company name is required!";
    isValid = false;
  } else {
    document.getElementById("companyError").innerText = "";
  }

  // Email Validation
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").innerText =
      "Enter a valid email address!";
    isValid = false;
  } else {
    document.getElementById("emailError").innerText = "";
  }

  // Password Validation
  let passwordPattern = /^(?=.*\d).{8,}$/;
  if (!passwordPattern.test(password)) {
    document.getElementById("passwordError").innerText =
      "Password must be 8+ chars";
    isValid = false;
  } else {
    document.getElementById("passwordError").innerText = "";
  }

  // Submit if all is valid
  return isValid;
}

async function sendOTP() {
  let email = document.getElementById("email").value.trim();
  let signIn_btn = document.getElementById("signIn_btn");

  try {
    signIn_btn.innerText = "Processing....";

    const response = await fetch("/verify/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    signIn_btn.innerText = "Sign In";
    console.log("otp-sent successfully!!!");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
}

async function storeUserData() {
  
  let companyName = document.getElementById("company").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  try{

    const response = await fetch("/user/register", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name:companyName , email , password})
    })

    const data = await response.json();

    if(data.success){
      console.log("data stored successfully");
      return true
    }else{
      document.getElementById("generalError").innerText = data.message;
      return false;
    }

  }catch(error){
    console.log("error in storing data" , error);
  }

}

async function verifyOTP(otp) {
  
  try {
    const response = await fetch("/verify/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("OTP verified successfully!");
      return true;

    } else {
      alert(data.message);
      return false;
    }

  } catch (error) {
    console.error("Error verifying OTP : ", error);
  }
}

document.querySelector(".verify").addEventListener("click", async (e) => {
  e.preventDefault();

  let otpInputs = document.querySelectorAll(".input-fields input");
  console.log(otpInputs);
  let otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join("");

  if (otp.length !== 6) {
    return;
  }

  let flag = await verifyOTP(otp);

  if(!flag) return;

  flag = await storeUserData();

  if(flag){
    window.location.href = "/user/login";
  }else{
    window.location.href = "/user/register"
    document.getElementById("generalError").innerText = data.message;
  }

});

document.querySelector(".clear").addEventListener("click", (e) => {
  e.preventDefault();
  document
    .querySelectorAll(".input-fields input")
    .forEach((input) => (input.value = ""));
});

async function checkUserExistance() {

  let email = document.getElementById("email").value.trim();
  console.log(email);
  
    try{
      const response = await fetch("/user/checkUser",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
      })

      const data = await response.json();
      console.log(data);

      if(!data.success){
          document.getElementById("generalError").innerText = data.message;
          return false;
      }

      return true;

    }catch(error){
      console.log("error in checkUser" , error);
    }

}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("form submited");

  if (!validateForm()) return;

  const flag = await checkUserExistance();
  if(!flag) return;

  await sendOTP();

  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("verifyform").classList.remove("hidden");

});



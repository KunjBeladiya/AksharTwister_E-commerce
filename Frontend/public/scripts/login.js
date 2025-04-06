console.log("script runnung");

function validateForm() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  let isValid = true;

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

async function loginUser() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    console.log(document.cookie);
    console.log(data.success);
    if (data.success) {
      window.location.href = "/";
    } else {
      document.getElementById("generalError").innerText = data.message;
    }
  } catch (error) {
    console.log("error in loginuser", error);
  }
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("form submited");

  if (!validateForm()) return;

  await loginUser();
});

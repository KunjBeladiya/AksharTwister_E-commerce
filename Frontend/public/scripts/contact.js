document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
  
    if (!form) return; // Safety check
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      let phoneInput = document.getElementById("phoneNumber");
      let phoneError = document.getElementById("phoneError");
      let phoneNumber = phoneInput.value.trim();
  
      // Regex for Indian phone numbers
      let phoneRegex = /^[6789]\d{9}$/;
  
      if (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = "Number is not valid";
        phoneInput.style.border = "2px solid red";
      } else {
        phoneError.textContent = "";
        phoneInput.style.border = "2px solid green";
  
        // Simulate form submission (e.g., show success message)
        document.getElementById("successMessage").style.display = "block";
        document.getElementById("errorMessage").style.display = "none";
  
        // Optionally reset form
        form.reset();
      }
    });
  });
  
  document.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (scrollY > 100) {
      navbar.classList.add("fixed");
    } else {
      navbar.classList.remove("fixed");
    }
  });
  
  window.addEventListener("load", async (event) => {
    try {
      const response = await fetch("/user/checkAuth", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      const data = await response.json();
      console.log(data);
  
      if (data.success) {
        document
          .getElementById("profilebtn")
          .classList.remove("hidden", "skeleton");
        document.getElementById("cartbtn").classList.remove("hidden", "skeleton");
      } else {
        document
          .getElementById("signupbtn")
          .classList.remove("hidden", "skeleton");
        document
          .getElementById("loginbtn")
          .classList.remove("hidden", "skeleton");
      }
    } catch (error) {
      console.log("error in homepage loading : ", error);
    }
  });

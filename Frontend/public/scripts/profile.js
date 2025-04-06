function initProfile() {
    let originalName = "";
    let originalPhone = "";
    let originalEmail = "";
    let originalPassword = "";

    async function fetchUserData() {
        try {
            const response = await fetch("/user/profile/data");
            const data = await response.json();
            if (data.success) {
                document.getElementById("name").value = data.user.name;
                document.getElementById("phone").value = data.user.phone;
                document.getElementById("email").value = data.user.email;
                originalName = data.user.name;
                originalPhone = data.user.phone;
                originalEmail = data.user.email;
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    }

    function changeSavebtnStatus() {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const newPassword = document.getElementById("newpassword").value;
        const phoneError = document.getElementById("phoneError");
        const saveBtn = document.getElementById("savebtn");

        // Phone number validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        const isPhoneValid = phoneRegex.test(phone);

        if (!isPhoneValid) {
            phoneError.innerText = "Enter a valid 10-digit phone number";
            phoneError.classList.remove("hidden");
            saveBtn.classList.add("cursor-not-allowed", "bg-gray-300");
            saveBtn.classList.remove("bg-blue-500");
            saveBtn.disabled = true;
            return;
        } else {
            phoneError.classList.add("hidden");
        }

        // Check if any changes were made
        const hasChanges = name !== originalName || phone !== originalPhone || newPassword !== "";

        if (hasChanges) {
            saveBtn.classList.remove("cursor-not-allowed", "bg-gray-300");
            saveBtn.classList.add("bg-blue-500");
            saveBtn.disabled = false;
        } else {
            saveBtn.classList.add("cursor-not-allowed", "bg-gray-300");
            saveBtn.classList.remove("bg-blue-500");
            saveBtn.disabled = true;
        }
    }

    document.getElementById("phone").addEventListener("input", changeSavebtnStatus);
    document.getElementById("name").addEventListener("input", changeSavebtnStatus);
    document.getElementById("newpassword").addEventListener("input", changeSavebtnStatus);

    document.getElementById("savebtn").addEventListener("click", async () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const oldPassword = document.getElementById("oldpassword").value;
        const newPassword = document.getElementById("newpassword").value;
        const confirmPassword = document.getElementById("confirmpassword").value;
        const passwordError = document.getElementById("passwordError");

        // Hide error message initially
        passwordError.innerText = "";
        passwordError.classList.add("hidden");

        if (name === originalName && phone === originalPhone && newPassword === "") {
            console.log("No changes detected, API call skipped.");
            return;
        }

        try {
            let updateSuccess = false;

            if (name !== originalName || phone !== originalPhone) {
                const response = await fetch("/user/profile/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ name, phone }),
                });

                if (response.ok) {
                    console.log("Profile updated successfully.");
                    originalName = name;
                    originalPhone = phone;
                    updateSuccess = true;
                }
            }

            if (newPassword !== "") {
                const passwordResponse = await fetch("/user/profile/updatePassword", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
                });

                const passwordData = await passwordResponse.json();

                if (!passwordData.success) {
                    passwordError.innerText = passwordData.message;
                    passwordError.classList.remove("hidden");
                    return;
                } else {
                    console.log("Password updated successfully.");
                    updateSuccess = true;
                }
            }

            if (updateSuccess) {
                document.getElementById("oldpassword").value = "";
                document.getElementById("newpassword").value = "";
                document.getElementById("confirmpassword").value = "";

                const saveBtn = document.getElementById("savebtn");
                saveBtn.classList.add("cursor-not-allowed", "bg-gray-300");
                saveBtn.classList.remove("bg-blue-500");
                saveBtn.disabled = true;
            }
        } catch (error) {
            console.log("Error updating profile:", error);
        }
    });

    document.getElementById("changePasswordtext").addEventListener("click", function () {
        const passwordDiv = document.getElementById("changePassworddiv");

        if (passwordDiv.classList.contains("hidden")) {
            passwordDiv.classList.remove("hidden");
        } else {
            passwordDiv.classList.add("hidden");
        }
    });

    // Fetch user data after initializing event listeners
    fetchUserData();
}

// Ensure `initProfile()` runs when script loads
initProfile();

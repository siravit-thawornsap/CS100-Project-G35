/*
  File: script.js
  Author: CS100 Team
  Date Created: 23 July 2023
  Copyright: CSTU
  Description: JS code of CSTU Passport that validate with JS
*/

const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const namesPattern = /^[a-z].*$/;
  const errorElement = document.getElementById("fullnameError");

  if (names.length !== 2 || !namesPattern.test(fullnameInput.value)) {
    errorElement.textContent = "Please enter both your Firstname and Lastname in English alphabet";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^6609[0-9].*$/;
  const errorElement = document.getElementById("studentIDError");

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter a 10-digit Student ID or start with 6609.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(`${config.backendUrl}getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }

  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description")
  };

  console.log(data);

  try {
    // Send data to the backend using POST request
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Format JSON data for display
      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      // Display success message with formatted data
      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document
  .getElementById("studentID")
  .addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);



// Function to handle form submission
function submitForm(event) {
  event.preventDefault(); // Prevents the default form submission behavior

  // Extract form data using FormData
  const formData = new FormData(event.target);

  // Loop through the form data and log each field's name and value
  for (const [name, value] of formData) {
    console.log(name, value);
  }

  // Reset the form after submission
  document.getElementById("myForm").reset();
}

fetch("./Backend/databases/records.json")
.then(function(response){
  return response.json();
})
.then(function(products){
  let placeholder = document.querySelector("#data-output");
  let out = "";
  var keyNames = Object.keys(products);
  for(let product of products){
    out += `
    <div class = "col-data">
      <ul>
        <li><strong>First name :</strong>${product.first_name} ${product.last_name} </li>
        <li><strong>Student id :</strong>${product.student_id}</li>
        <li><strong>Email :</strong>${product.email}</li>
        <li><strong>Title :</strong>${product.title}</li>
        <li><strong>Academic Year :</strong>${product.academic_year}</li>
        <li><strong>Semester :</strong>${product.semester}</li>
        <li><strong>Start Date :</strong>${product.start_date.split('T')[0]} ${product.start_date.split('T')[1].replace('Z','')}</li>
        <li><strong>End Date :</strong>${product.end_date.split('T')[0]} ${product.end_date.split('T')[1].replace('Z','')}</li>
        <li><strong>Location :</strong>${product.location}</li>
        <li><strong>Description :</strong>${product.description}</li>
      </ul>
    </div>
    `;
  }
  placeholder.innerHTML = out;
})


// Attach a submit event listener to the form
document.getElementById("myForm").addEventListener("submit", submitForm);
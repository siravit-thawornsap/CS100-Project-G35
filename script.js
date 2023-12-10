const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

  const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
  // Function to validate Firstname and Lastname
  function validateName() {
    const fullnameInput = document.getElementById("fullname");
    const names = fullnameInput.value.trim().split(" ");
    const errorElement = document.getElementById("fullnameError");
    if (names.length !== 2 ) {
      errorElement.textContent = "Please enter both your Firstname and Lastname.";
      setError(fullnameInput , 'Please enter both your Firstname and Lastname.');
      return false;
    }else {
      // Check if each part contains only English letters
      const nameReg = /^[a-zA-Z]+$/;
  
      if (!nameReg.test(names[0]) || !nameReg.test(names[1])) {
        errorElement.textContent = "Please enter valid Firstname and Lastname using only English letters.";
        setError(fullnameInput , 'Please enter valid Firstname and Lastname using only English letters.');
        return false;
      } else {
        errorElement.textContent = ""; // Clear the error message when valid
        setSuccess(fullnameInput);
      }
    }
    
    return true;
  }


  // Function to validate Student ID
  function validateStudentID() {
    const studentIDInput = document.getElementById("studentID");
    const studentIDPattern = /^66096\d{5}$/;
    const errorElement = document.getElementById("studentIDError");

    if (!studentIDPattern.test(studentIDInput.value)) {
      errorElement.textContent = "Please enter a 10-digit Student ID.";
      setError(studentIDInput , 'Please enter a 10-digit Student ID.');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      setSuccess(studentIDInput);
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
        setError(emailInput, 'Please provide a valid university email in the format "xxx.yyy@dome.tu.ac.th".');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      setSuccess(emailInput);
    }
    return true;
  }
  
// Function to validate form inputs on user input
function validateFormOnInput() {
  const isNameValid = validateName();
  const isStudentIDValid = validateStudentID();
  const isEmailValid = validateEmail();

  if (isNameValid) {
      setSuccess(document.getElementById("fullname"));
  }

  if (isStudentIDValid) {
      setSuccess(document.getElementById("studentID"));
  }

  if (isEmailValid) {
      setSuccess(document.getElementById("email"));
  }
}

  
  // Function to fetch activity types from the backend
  async function fetchActivityTypes() {
    try {
      const response = await fetch(config.backendUrl + "getActivityType");
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
   /* if (!validateName() || !validateStudentID() || !validateEmail()) {
      return;
    }
  
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
  
    if (endDate <= startDate) {
      alert("End datetime should be after the start datetime.");
      setError(endDateInput , 'Please enter both your Firstname and Lastname.');
      return;
    }
  */
    // Create the data object to send to the backend
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get("fullname").split(" ")[0],
      last_name: formData.get("fullname").split(" ")[1],
      student_id: parseInt(formData.get("studentID")),
      email: formData.get("email"),
      type_of_work_id: parseInt(formData.get("activityType")),
      semester: parseInt(formData.get("semester")),
      start_date: formData.get("startDate"),
      location: formData.get("location"),
      description: formData.get("description")
    };
  
    console.log(data);
  
    try {
      // Send data to the backend using POST request
      const response = await fetch(config.backendUrl + "record", {
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
    function showInput() {
      var name = document.getElementById("fullname").value;
      var studentID = document.getElementById("studentID").value;
      var universityEmail = document.getElementById("email").value;
      var workTitle = document.getElementById("workTitle").value;
      var workType = document.getElementById("activityType").value;
      var academicYear = document.getElementById("academicYear").value;
      var semester = document.getElementById("semester").value;
      var startDate = document.getElementById("startDate").value;
      var endDate = document.getElementById("endDate").value;
      var location = document.getElementById("location").value;
      var description = document.getElementById("description").value;
    
      if (name &&studentID &&universityEmail &&workTitle &&workType 
        &&academicYear &&semester &&startDate &&endDate &&location ||description) {
          var result =
          "<p>Firstname and Lastname: " +name +"</p>" +
          "<p>Student ID: " +studentID +"</p>" +
          "<p>University Email: " +universityEmail +"</p>" +
          "<p>Work/Activity Title: " +workTitle +"</p>" +
          "<p>Type of Work/Activity: " +workType +"</p>" +
          "<p>Academic Year: " +academicYear +"</p>" +
          "<p>Semester: " +semester +"</p>" +
          "<p>Start Date/Time: " +startDate +"</p>" +
          "<p>End Date/Time: " +endDate +"</p>" +
          "<p>Location: " +location +"</p>" +
          "<p>Description: " +description +"</p>";
    
          display_message.innerHTML = result;
      } else {
        alert("Please fill in all required information.");
      }
    }
  
// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  // Create the data object from the form inputs
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

  // Display the data on the page
  displayFormData(data);

  // Reset the form after submission
  document.getElementById("myForm").reset();
});

// Function to display form data on the page
function displayFormData(data) {
  const outputElement = document.getElementById("data-output");
  outputElement.innerHTML = `
    <div class="col-data">
      <ul>
        <li><strong>First name:</strong> ${data.first_name} ${data.last_name}</li>
        <li><strong>Student id:</strong> ${data.student_id}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Title:</strong> ${data.title}</li>
        <li><strong>Academic Year:</strong> ${data.academic_year}</li>
        <li><strong>Semester:</strong> ${data.semester}</li>
        <li><strong>Start Date:</strong> ${data.start_date}</li>
        <li><strong>End Date:</strong> ${data.end_date}</li>
        <li><strong>Location:</strong> ${data.location}</li>
        <li><strong>Description:</strong> ${data.description}</li>
      </ul>
    </div>
  `;
}


document.addEventListener('DOMContentLoaded', function () {
// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (validateForm()) {
      // Perform any necessary actions (e.g., submit the form to a server)

      // Reset the form
      document.getElementById("myForm").reset();
  }
  });
});
// Function to validate form data
function validateForm() {
  // Add your validation logic here
  // Return true if the form is valid, false otherwise
  // You can also display error messages if needed

  // Example: Check if start date is before end date
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  if (endDate <= startDate) {
      setError(document.getElementById("endDate"), 'End datetime should be after the start datetime.');
      return false;
  }

  // For now, let's assume the form is always valid
  return true;
}
  const out1 = document.getElementById('out1');
  const out2 = document.getElementById('out2');
  const out3 = document.getElementById('out3');
  const out4 = document.getElementById('out4');
  const out5 = document.getElementById('out5');
  const out6 = document.getElementById('out6');
  const out7 = document.getElementById('out7');
  const out8 = document.getElementById('out8');
  const submit = document.getElementById('submit');
  const fullname = document.getElementById('fullname');
  const studentID = document.getElementById('studentID');
  const email = document.getElementById('email');
  const activityType = document.getElementById('activityType');
  const semester = document.getElementById('semester');
  const startDate = document.getElementById('startDate');
  const location = document.getElementById('location');
  const description = document.getElementById('description');


  function  fun1(){
     out1.innerHTML = fullname.value;
     out2.innerHTML = studentID.value;
     out3.innerHTML = email.value;
     out4.innerHTML = activityType.value;
     out5.innerHTML = semester.value;
     out6.innerHTML = startDate.value;
     out7.innerHTML = location.value;
     out8.innerHTML = description.value;
    
  }
  submit.addEventListener('click',fun1);
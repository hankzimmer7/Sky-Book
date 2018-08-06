// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

//Execution once the page loads
$(document).ready(function () {

  //This displays the popup modal for creating an accout
  // Get the modal
  var modal = document.getElementById("sign-up-modal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  $("#sign-up-link").on("click", function (event) {

    modal.style.display = "block";

  });

  $("#create-account-submit").on("click", function (event) {
    event.preventDefault();

    //Grab the data from the inputs
    var username = $("#usernameInput").val().trim();
    console.log("Username is " + username);
    var password = $("#passwordInput").val().trim();
    console.log("Password is " + password);
    var passwordCheck = $("#passwordInputCheck").val().trim();
    console.log("Password Check is " + passwordCheck);

    //Initially all fields are assumed to be complete. Then set this variable to false later if a field is found incomplete.
    var allFieldsComplete = true;
    var passwordsMatch = (password === passwordCheck);
    console.log("Do the passwords match?");
    console.log(passwordsMatch);

    if (username === "" || password === "" || passwordCheck === "") {
      allFieldsComplete = false;
    }

    if (allFieldsComplete && passwordsMatch) {
      //Create a new object for the user's responses
      var newUser = {
        username: username,
        password: password
      };

      console.log(newUser);

      $.post("/api/users", newUser,
        function (data) {
          console.log(data);

        });

    } else if (allFieldsComplete === false) {
      alert("Please complete all fields before submitting!");
    } else if (passwordsMatch === false) {
      alert("The two password inputs do not match!");
      $("#passwordInput").val("");
      $("#passwordInputCheck").val("");
    }

  });
});
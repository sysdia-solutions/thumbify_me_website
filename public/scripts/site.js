var pollResultsTimeout = null;
var tries = 0;
var maxTries = 20;

$(document).ready(function() {
  init();
});

function init() {
  $(".register .btn").click(function(e) {
    e.preventDefault();
    signup();
    return false;
  });

  $(".tryme .btn").click(function(e) {
    e.preventDefault();
    tryme();
    return false;
  });
}

function toggleSignupButton(processing) {
  var btn = $(".register .btn");
  var text = "Sign up for free";

  btn.removeAttr("disabled");
  if (processing) {
    text = "Signing up now";
    btn.attr("disabled", true);
  }
  btn.html(text);
}

function signup() {
  var email = $(".register .email").val();
  $(".register").removeClass("has-error");
  $(".register .help-block").html("");
  toggleSignupButton(true);

  $.ajax({
    type: "POST",
    url: api + "/users",
    data: { "email": email },
    success: function(output, textStatus, jqXHR) {
      signupSuccess(output.email);
    },
    error: function(jqXHR, textStatus, error) {
      var reason = JSON.parse(jqXHR.responseText).message.email[0];
      signupError(reason);
    }
  });
}

function signupSuccess(email) {
  $(".register").fadeOut(500, function() {
    $(".registered .email").html(email);
    $(".registered").fadeIn(500);
  });
}

function signupError(reason) {
  $(".register").addClass("has-error");
  $(".register .help-block").html("Email " + reason);
  toggleSignupButton(false);
}

function tryme() {
  var url = $(".tryme .url").val();
  $("#tryme-modal .modal-body").html("<h2>Please wait whilst the thumbifier deals with your request.</h2>");
  $("#tryme-modal").modal("show").on("hidden.bs.modal", function() { trymeReset() });

  $.ajax({
    type: "POST",
    url: rootUrl + "request.php",
    data: {
      "media_url": url,
      "callback_url": rootUrl + "callback.php",
      "dimensions": "500x500"
    },
    success: function(output, textStatus, jqXHR) {
      trymeSuccess(output);
    },
    error: function(jqXHR, textStatus, error) {
      var message = "An unknown error has occured."
      if (jqXHR.status > 0) {
        message = JSON.parse(jqXHR.responseText).message;
      }
      trymeError(jqXHR.status, message);
    }
  });
}

function trymeReset() {
  pollResultsTimeout = null;
  tries = 0;
}

function trymeSuccess(responseId) {
  $.ajax({
    type: "GET",
    url: rootUrl + "results.php",
    data: { "response_id": responseId },
    success: function(output, textStatus, jqXHR) {
      processResults(responseId, output);
    },
    error: function(jqXHR, textStatus, error) {
      var message = "An unknown error has occured."
      if (jqXHR.status > 0) {
        message = (jqXHR.responseText);
      }
      trymeError(jqXHR.status, message);
    }
  });
}

function trymeError(status, message) {
  trymeReset();
  switch(status) {
    case 401: message = "The access token has expired.<br/>Refresh the website and try again.";
              break;
    case 400: message = "The url provided is not valid, try another one!";
              break;
    case 429: message = "The thumbifier is a bit overloaded at the moment.<br/>Try again in about 10 minutes!";
              break;
  }

  $("#tryme-modal .modal-body").html("<h2>" + message + "</h2>");
}

function processResults(responseId, data) {
  pollResultsTimeout = null;
  switch(data.status) {
    case "pending": pollResults(responseId);
                    break;
    case "ok":      displayResults(data.payload);
                    break;
    case "error":   trymeError(null, data.payload);
                    break;
  }
}

function pollResults(responseId) {
  if (tries < maxTries) {
    pollResultsTimeout = setTimeout(function() { trymeSuccess(responseId) }, 2000);
    tries+=1;
  } else {
    trymeError(null, "It's taking too long to get the thumbified jpg back, so we're giving up. Perhaps try again with a smaller file size?");
  }
}

function displayResults(image) {
  trymeReset();
  $("#tryme-modal .modal-body").html("<h2>Success!!</h2><img src='data:image/jpeg;charset=utf-8;base64," + image + "' />");
}

function getSupportedMimeTypes() {
  $.ajax({
    type: "GET",
    url: api,
    success: function(output, textStatus, jqXHR) {
      displayMimeTypes(output);
    },
    error: function(jqXHR, textStatus, error) {
    }
  });
}

function displayMimeTypes(types) {
  var items = [];
  $.each(types, function (id, option) {
    items.push('<li>' + option + '</li>');
  });
  $(".mime-types").html(items.join(''));
}

$(document).ready(function() {
  init();
});

function link(page) {
  window.location.href = rootPage + "/" + page;
}

function init() {
  $(".register .btn").click(function(e) {
    e.preventDefault();
    signup();
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

var answers = [];
var questions = [];
var i;
var k=1;
var totalQuestions=0;
var x;
var temp_user;

//Retrieve Data
var Ref = firebase.database().ref('quiz_questions').limitToLast(10);

Ref.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    questions.push(childData);
    //console.log(childData);
  });
 totalQuestions = questions.length;
 $("#test_start").attr("disabled",false).val("Click to Start Your Test");
});
//end Retrieve Data

function model_questions(){
    
    var pageheader = '<header style="position: -webkit-sticky; position: sticky; top: 0; background-color: #e6f2ff; font-size: 20px;">'
                      +'<div class="row">'
                        +'<div class="col-lg m-auto">'
                          +'<img class="rounded-circle mr-1" height="50" width="50" id="user_img" src="">'
                          +'<span id="user_name"></span>'
                        +'</div>'
                        +'<div class="col-lg">'
                          +'<h1>CBAP Test</h1>'
                          +'<p>Test your knowledge in CBAP</p>'
                        +'</div>'
                        +'<div class="col-lg m-auto">'
                          +'<span id="countDown">Count Down: 9:60</span>'
                        +'</div>'
                      +'</div>'
                    +'</header>'
                    +'<div id="results"></div>'
                    +'<section id="questionframe">'
                    +'</section>';
    
    $("#container").html(pageheader);

	document.getElementById("user_img").setAttribute("src", temp_user.photoURL);
	document.getElementById("user_name").innerHTML = temp_user.displayName;
    var questionFrame = '<form name="quizForm" onsubmit="return submitAnswers()">'
                      +'<div id="questions" style="font-size: 20px;">'
	    			
                      +'</div>'
                      +'<div>'
                            +'<input type="submit" value="Submit Answers">'
                      +'</div>'
                    +'</form>';
    
    document.getElementById("questionframe").innerHTML=questionFrame;
    for(k=0;k<totalQuestions;k++){
        var quiz_questions = '<h5>'+ (k+1)+'.'+questions[k].question+'</h5>'
		    		+'<input type="radio" id="radioButton" name="q'+k+'" value="'+1+'"><span>'+questions[k].option1+'</span><br>'
		    		+'<input type="radio" id="radioButton" name="q'+k+'" value="'+2+'"><span>'+questions[k].option2+'</span><br>'
		    		+'<input type="radio" id="radioButton" name="q'+k+'" value="'+3+'"><span>'+questions[k].option3+'</span><br>'
		    		+'<input type="radio" id="radioButton" name="q'+k+'" value="'+4+'"><span>'+questions[k].option4+'</span><br>'
		    		+'<br>';

		$("#questions").append(quiz_questions);
    }
    countDown();
}

function submitAnswers(){
	
	answers = [];
	var total = questions.length;
    //alert("total "+total);
	var score = 0;

	for(i=0;i<total;i++){
		 var q = document.forms["quizForm"]["q"+i].value;
         //alert(q);
		 answers.push(q);
	}

//	for(i=0;i<total;i++){
//		if(answers[i]==null || answers[i]==""){
//			var j=i+1;
//			alert("You missed question "+j);
//			return false;
//		}
//	}

	for(i=0;i<total;i++){
        //alert(answers[i]+'\n'+correctAnswers[i]);
		if(answers[i]==questions[i].answerNumber){
			score++;
		}
	}
    clearInterval(x);
    document.getElementById("countDown").innerHTML = "Finished" ;
	var results = document.getElementById("results");
	results.innerHTML = '<h2>Congratulations</h2><h3>You scored '+score+' out of '+total+'</h3><a class="mr-5" href="index.html">Visit Our Page</a>';
	$("form").html("");
	//alert("you scored "+ score + " out of " + total);

	return false;


}

function login(){
	console.log('login called');
	function newLoginHappend(user){
		if(user){
            document.getElementById("user_img").setAttribute("src", user.photoURL);
	        document.getElementById("user_name").innerHTML = user.displayName;
            temp_user = user;
			//model_questions();
		}else{
			 var provider = new firebase.auth.GoogleAuthProvider();
             provider.setCustomParameters({
                  prompt: 'select_account'
                });
			 firebase.auth().signInWithRedirect(provider);
			 firebase.auth().getRedirectResult().then(function(result) {
			   if (result.credential) {
			     // This gives you a Google Access Token. You can use it to access the Google API.
			     var token = result.credential.accessToken;
			     // ...
			   }
			   // The signed-in user info.
			   var user = result.user;
			 }).catch(function(error) {
			   // Handle Errors here.
			   var errorCode = error.code;
			   var errorMessage = error.message;
			   // The email of the user's account used.
			   var email = error.email;
			   // The firebase.auth.AuthCredential type that was used.
			   var credential = error.credential;
			   // ...
			   document.getElementById("results").innerHTML = errorMessage;
			 });
		}
	}

	firebase.auth().onAuthStateChanged(newLoginHappend);
}

//Add timer
function countDown(){
    var countDownDate = new Date().getTime() + 10*60*1000;

    // Update the count down every 1 second
      x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
     //  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
     //  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      document.getElementById("countDown").innerHTML = "Count Down: "+ minutes + ":" + seconds ;

      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("countDown").innerHTML = "Time Up";
        submitAnswers();
      }
    }, 1000);
}


function signOut(){
    firebase.auth().signOut().then(function() {
    login();
    }).catch(function(error) {
      // An error happened.
    });
}


window.onload = login();
$("#signOut").click(function(){
    signOut();
})
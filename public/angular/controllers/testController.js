myApp.controller('testController', ['SkillService', '$routeParams', '$timeout', '$scope',
    function (SkillService, $routeParams, $timeout, $scope) {
        var main = this;
        main.testData = {};
        main.id = $routeParams.id;
        main.questionIndex = 0;
        main.questions = [];
        main.showNext = true;
        main.buttonText = "Next";
        main.score = 0;
        main.testResult = {};

        //Test Code
        main.counter = 300; //In seconds(default)
        main.endOfTime = false;
        main.onTimeout = function () {
            if (main.counter == 0) {
                console.log("Inside If");
                main.endOfTime = true;
                $timeout.cancel(mytimeout);
                main.callSubmitTets();
            } else {
                console.log("Inside else loop")
                main.counter--;
                mytimeout = $timeout(main.onTimeout, 1000);
            }
        }
        //  
        main.stop = function () {
            console.log("Inside cancel");
            $timeout.cancel(mytimeout);
        }
        //Test code ends

        this.getTestById = function (id) {
            SkillService.getTestById(id).then((response) => {
                main.testData = response.data.data;
                main.questions = main.testData.questions;
                console.log(main.testData);
                main.counter = main.testData.duration * 60;
              //To Test
             // main.counter=5;
                var mytimeout = $timeout(main.onTimeout, 1000);
            }, (err) => {
                alert("Oops something went wrong");
            })
        }

        this.getNextQuestion = function () {
            console.log(main.test);
            // get answer
            if (main.test == '' || main.test == undefined) {
                alert("please answer the question to go forward");
                return;
            }
            //Check if answer is right.
            //If right increase score by 10
            if (main.questions[main.questionIndex].answer == main.test) {
                //Add 10 points
                main.score = main.score + 10;
            }
            //After answering each question submit the answer before posting the next question
            //construct the data to be sent
            var data = {
                testId: main.id,
                questionId: main.questions[main.questionIndex]._id,
                givenAnswer: main.test,
                correctAnswer: main.questions[main.questionIndex].answer
            }
            //Call Service to submit the answer
            SkillService.saveAnswer(data).then((response) => {
                if (response.data.error) {
                    alert("Oops soemthing gone wrong. Please try again");
                    return;
                }
            }, (err) => {
                alert("Oops soemthing gone wrong. Please try again");
                return;
            })
            if (main.questionIndex < main.questions.length - 1) {
                //Clear radio model
                main.test = "";
                console.log(main.questionIndex);
                main.questionIndex = main.questionIndex + 1;
                if (main.questionIndex == main.questions.length - 1) {
                    main.buttonText = "Show results";
                }
            } else {
                //call submit test method
                $timeout.cancel(mytimeout);
                this.callSubmitTets();
            }

        }

        //Method to submit test
        this.callSubmitTets = function () {
            //Submit Test Logic comes here
            //Construct data
            var correctAnswer = (main.score / 10);
            var wrongAnswer = 0;
            var timeTaken=0;
            timeTaken=((main.testData.duration*60)-(main.counter));
            if (correctAnswer == main.questions.length) {
                wrongAnswer = 0;
            } else {
                wrongAnswer = main.questions.length - correctAnswer;
            }

            console.log("Submit test")
            var data = {
                testIds: main.id,
                testScore: main.score,
                correctAnswers: correctAnswer,
                wrongAnswers: wrongAnswer,
                testName: main.testData.name,
                timeTaken:timeTaken
            }

            //Make service call
            SkillService.saveTest(data).then((response) => {
                //Display final score for the user
                console.log(response.data);
                if (response.data.error) {

                } else {
                    main.showNext = false;
                    main.testResult = response.data.data;
                }

            }, (err) => {
                alert("Oops something gone wrong. Please try again")
            })
        }

        //Get Test by Id
        this.getTestById(this.id);
        //Kill the counter if user clicks on back button
        $scope.$on("$destroy", function () {
            if (mytimeout) {
                $timeout.cancel(mytimeout);
            }
        });
    }

]);
/*
myApp.filter('toMinSec', function () {
    return function (input) {
        var minutes = parseInt(input / 60, 10);
        var seconds = input % 60;

        return minutes + ' minutes' + (seconds ? ' and ' + seconds + ' seconds' : '');
    }
})
*/
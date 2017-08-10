myApp.controller('testController', ['SkillService', '$routeParams',
    function (SkillService, $routeParams) {
        var main = this;
        main.testData = {};
        main.id = $routeParams.id;
        main.questionIndex = 0;
        main.questions = [];
        main.showNext = true;
        main.buttonText="Next";
        main.score = 0;
        this.getTestById = function (id) {
            SkillService.getTestById(id).then((response) => {
                main.testData = response.data.data;
                main.questions = main.testData.questions;
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
                //Submit Test Logic comes here
                //Construct data
                var correctAnswer=(main.score/10);
                var wrongAnswer=main.questions.length-correctAnswer;
                console.log("Submit test")
                var data={
                    testId: main.id,
                    testScore:main.score,
                    correctAnswers:correctAnswer,
                    wrongAnswers:wrongAnswer
                }

                //Make service call
                SkillService.saveTest(data).then((response)=>{
                    //Display final score for the user
                    console.log(response.data);
                },(err)=>{
                    alert("Oops something gone wrong. Please try again")
                })
            }

        }

        //Get Test by Id
        this.getTestById(this.id)
    }
])
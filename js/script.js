window.onload = function()
{
    let questionsArray = document.getElementsByClassName("whatIsYourQuestion");
    let navQuestionsToAdd = document.getElementsByTagName("nav")[0];
    let navHeight = navQuestionsToAdd.offsetTop;
    for(let i = 1; i <= questionsArray.length; i++)
    {
        let navNewQuestion = document.createElement("div");
        questionsArray[i-1].id = "q" + i.toString();
        navNewQuestion.className = "questionTag";
        navNewQuestion.innerHTML = "<a href='#q"+i.toString()+"'>"+i.toString()+"</a>";
        navQuestionsToAdd.appendChild(navNewQuestion);
    }
    document.querySelectorAll("a[href^='#q']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            let target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - navHeight
                });
            }
        });
    });

    let questionCount = 1;
    let whatIsYourQuestionHintParent = document.querySelectorAll(".whatIsYourQuestion");
    whatIsYourQuestionHintParent.forEach(parentElement =>
        {
            let newSpanQuestionNumberText = document.createElement("span");
            newSpanQuestionNumberText.className = "questionNumberText";
            parentElement.prepend(newSpanQuestionNumberText);
            let HintChild = parentElement.querySelectorAll("*");
            let spanTextHint = parentElement.querySelector(".questionNumberText");
            spanTextHint.innerHTML = "Question "+(questionCount++).toString();
            let newSpan = document.createElement("span");
                HintChild.forEach(childElement =>
                {
                    if(childElement.className == "chooseOneAnswer")
                    {
                        newSpan.className = "hint";
                        newSpan.textContent = "Choose one answer!";
                    }
                    else if(childElement.className == "chooseMultipleAnswers")
                    {
                        newSpan.className = "hint";
                        newSpan.textContent = "Choose one or more answers!";
                    }
                    else if(childElement.className == "dropAnswer")
                    {
                        newSpan.className = "hint";
                        if(!isTouch())
                        {
                            newSpan.textContent = "Drag and drop one or more answers into the box!";
                        }else
                        {
                            newSpan.textContent = "Choose one or more answers!";
                        }
                    }
                });
                spanTextHint.appendChild(newSpan);
        });

        const xhr = new XMLHttpRequest();

        xhr.open("GET", "xml/answers.xml", true);

        xhr.responseType = "document";

        xhr.onload = function()
        {
            if(xhr.status==200)
            {
                const xmlDoc = xhr.responseXML;

                const questions = xmlDoc.getElementsByTagName("Question");

                for(let i = 0; i<questions.length; i++)
                {
                    let question = questions[i];
                    let questionXMLid = question.getAttribute("id");
                    let questionHTML = document.getElementById(questionXMLid).getElementsByClassName("answerBox")[0].getElementsByTagName("div")[0];
                    const answers = question.getElementsByTagName("Answer");
                    let newAnswerDivCointainer = document.createElement("div");
                    let countCorrectText = document.createElement("span");
                    let whatIsSpace = document.getElementById(questionXMLid);
                    let countCorrect = 0;
                    let wrongAnswerTable = [];
                    let more = question.getAttribute("more");
                    let moreDivSpace;
                    let isDropHandlerAdded = false;
                    if(more=="true")
                    {
                        moreDivSpace = document.createElement("div");
                        moreDivSpace.innerText = question.getAttribute("moreDescription");
                        moreDivSpace.className = "newMoreDiv";
                        whatIsSpace.appendChild(moreDivSpace);
                        console.log(whatIsSpace);
                    }
                    for(let k = 0; k < answers.length; k++)
                    {
                        if(answers[k].getAttribute("correct")=="true")
                        {
                            countCorrect++;
                        }
                        else
                        {
                            wrongAnswerTable.push(k);
                        }
                    }
                    let whatIsSpaceAdded = false;
                    let newAnswerDivDrop;
                    let divCountCorrectDrop
                    if(questionHTML.className == "dropAnswer")
                            {
                                newAnswerDivDrop = document.createElement("div");
                                newAnswerDivDrop.className = "dropHere";
                                newAnswerDivDrop.textContent = "Drop here!";
                                newAnswerDivDrop.style.userSelect = "none";
                                newAnswerDivCointainer.className = "AnswerDropDivsCointainer";
                                divCountCorrectDrop = document.createElement("div");
                                divCountCorrectDrop.classList = "countCorrectText";
                                divCountCorrectDrop.style.display = "none";
                                questionHTML.appendChild(divCountCorrectDrop);
                                questionHTML.appendChild(newAnswerDivCointainer);
                                questionHTML.appendChild(newAnswerDivDrop);
                            }
                    for(let j = 0; j < answers.length; j++)
                        {
                            const answer = answers[j];
                            let correct = answer.getAttribute("correct");
                            let correctClicked = false;
                            let navIdCorrect = document.querySelector("a[href='#" + questionXMLid +"']");
                        if(questionHTML.className == "chooseOneAnswer" || questionHTML.className == "chooseMultipleAnswers")
                            {
                            let newAnswerDiv = document.createElement("div");
                            newAnswerDiv.textContent = answer.textContent;
                            questionHTML.appendChild(newAnswerDiv);
                                if(correct=="true")
                                {
                                    newAnswerDiv.addEventListener("mouseup", () =>
                                    {
                                        if(!correctClicked){
                                        newAnswerDiv.style.backgroundColor = "rgba(85, 193, 3, 1)";
                                        newAnswerDiv.style.cursor = "default";
                                        if(countCorrect--)
                                        {
                                            if(!countCorrect)
                                            {
                                                countCorrectText.textContent ="Great that's all!";
                                                navIdCorrect.style.backgroundColor="rgba(85, 193, 3, 1)";
                                                if(wrongAnswerTable.length)
                                                {
                                                    for(let y = 0; y < wrongAnswerTable.length; y++)
                                                    {
                                                        questionHTML.getElementsByTagName("div")[wrongAnswerTable[y]].style.display = "none";
                                                    }
                                                }
                                                if(more=="true")
                                                {
                                                    moreDivSpace.style.display = "block";
                                                    window.scrollTo({
                                                        top: moreDivSpace.offsetTop - navHeight - whatIsSpace.offsetHeight
                                                    });
                                                }
                                            }else
                                                {
                                                    countCorrectText.textContent = countCorrect + " more...";
                                                }
                                            
                                            if(!whatIsSpaceAdded)
                                            {
                                                countCorrectText.classList = "countCorrectText";
                                                whatIsSpace.prepend(countCorrectText);
                                                whatIsSpaceAdded = true;
                                            }
                                        }
                                        correctClicked = true;
                                        }
                                        
                                    });
                                }else
                                {
                                    let randomNumber;
                                    let dontClickAgain = false;
                                    let isRunning = false;
                                    let currentColor = window.getComputedStyle(newAnswerDiv).backgroundColor;
                                    let currentBorder = window.getComputedStyle(newAnswerDiv).border;
                                    newAnswerDiv.addEventListener("mouseup", () =>
                                    {
                                        if(isRunning)
                                        {
                                            return;
                                        }
                                        randomNumber = Math.floor(Math.random() * 5);
                                        newAnswerDiv.style.backgroundColor = "rgba(255, 41, 41, 0.8)";
                                        if(!dontClickAgain){
                                            let currentText = newAnswerDiv.textContent;
                                            switch(randomNumber)
                                            {
                                                case 0:
                                                    newAnswerDiv.textContent = "Oh no! Unfortunately wrong.";
                                                    break;
                                                case 1:
                                                    newAnswerDiv.textContent = "Maybe try a different answer ;)";
                                                    break;
                                                case 2:
                                                    newAnswerDiv.textContent = "Please try again.";
                                                    break;
                                                case 3:
                                                    newAnswerDiv.textContent = "Do not give up!";
                                                    break;
                                                case 4:
                                                    newAnswerDiv.textContent = "Oops! Try another.";
                                                    break;
                                            }
                                            isRunning = true;
                                            setTimeout(()=>
                                            {
                                                newAnswerDiv.innerHTML = currentText + " - <b>Don't click it again!</b>";
                                                newAnswerDiv.style.backgroundColor = currentColor;
                                                newAnswerDiv.addEventListener("mouseover", ()=>
                                            {
                                                newAnswerDiv.style.borderColor = "red";
                                            });
                                            newAnswerDiv.addEventListener("mouseleave", ()=>
                                            {
                                                newAnswerDiv.style.border = currentBorder;
                                            });
                                            isRunning = false;
                                            }, 1700);
                                        }else
                                        {
                                            newAnswerDiv.textContent = "Don't worry, I'll help you!";
                                            isRunning = true;
                                            setTimeout(()=>
                                            {
                                                newAnswerDiv.style.display="none";
                                                isRunning = false;
                                            }, 1700);
                                        }
                                        dontClickAgain = true;
                                    });
                                }
                            }
                    else if(questionHTML.className == "dropAnswer")
                        {
                            let newAnswerDiv = document.createElement("div");
                            newAnswerDiv.textContent = answer.textContent;
                            newAnswerDivCointainer.appendChild(newAnswerDiv);
                                if(!isTouch()){
                                newAnswerDiv.style.userSelect="none";
                                newAnswerDiv.id = "answer"+i+j;
                                newAnswerDiv.setAttribute("draggable", "true");
                                if(correct=="true")
                                {
                                    newAnswerDiv.addEventListener("dragstart", (e)=>
                                    {
                                        e.dataTransfer.setData("text/plain", e.target.textContent);
                                        e.dataTransfer.setData("text/id", newAnswerDiv.id);
                                        e.dataTransfer.setData("text/valid-answer", "answerV" + i.toString());
                                    });
                                    if(!isDropHandlerAdded)
                                            {
                                            newAnswerDivDrop.addEventListener("dragover",(e)=>
                                            {
                                                e.preventDefault();
                                            });
                                            newAnswerDivDrop.addEventListener("drop", (e)=>
                                            {
                                                e.preventDefault();
                                                let validAnsewer = e.dataTransfer.getData("text/valid-answer");
                                                if(validAnsewer != "answerV" + i.toString())
                                                {
                                                    return;
                                                }
                                                if(newAnswerDivDrop.contains(e.target))
                                                {
                                                    if(newAnswerDivDrop.textContent === "Drop here!") 
                                                    {
                                                        newAnswerDivDrop.textContent = "";
                                                    }
                                                    let dataText = e.dataTransfer.getData("text/plain");
                                                    let dataId = e.dataTransfer.getData("text/id");
                                                    let draggedElement = document.getElementById(dataId);
                                                    let newDiv = document.createElement("div");
                                                    newDiv.textContent = dataText;
                                                    newDiv.classList = "droppedDiv";
                                                    newAnswerDivDrop.appendChild(newDiv);
                                                    draggedElement.style.display = "none";
                                                    if(divCountCorrectDrop.style.display == "none")
                                                    {
                                                        divCountCorrectDrop.style.display == "block";
                                                    }
                                                    divCountCorrectDrop.style.display = "block";
                                                    if(!--countCorrect)
                                                    {
                                                        navIdCorrect.style.backgroundColor="rgba(85, 193, 3, 1)";
                                                        divCountCorrectDrop.textContent = "Great that's all!";
                                                        let wrongDivs = questionHTML.querySelector(".AnswerDropDivsCointainer").querySelectorAll("div");
                                                        for(let wrongDiv of wrongDivs) 
                                                        {
                                                            wrongDiv.style.display = "none";
                                                        }
                                                    }
                                                    else
                                                    {
                                                        divCountCorrectDrop.textContent = countCorrect + " more...";
                                                    }
                                                }
                                            });
                                            isDropHandlerAdded=true;
                                        }
                                }else
                                {
                                    let dontClickAgain = false;
                                    newAnswerDiv.addEventListener("mousedown", ()=>
                                    {
                                        if(!dontClickAgain)
                                        {
                                            let randomNumber = Math.floor(Math.random() * 4);
                                            switch(randomNumber)
                                            {
                                                case 0:
                                                    newAnswerDiv.textContent = "Ups ;)";
                                                    break;
                                                case 1:
                                                    newAnswerDiv.textContent = "Nooo!";
                                                    break;
                                                case 2:
                                                    newAnswerDiv.textContent = "Another one!";
                                                    break;
                                                case 3:
                                                    newAnswerDiv.textContent = "Oh...";
                                                    break;
                                            }
                                        }
                                        dontClickAgain = true;
                                        newAnswerDiv.style.backgroundColor = "rgba(255, 41, 41, 0.8)";
                                        newAnswerDiv.setAttribute("draggable", "false");
                                    });
                                }
                            }
                            else
                            {
                                newAnswerDivDrop.style.display = "none";
                                if(correct=="true")
                                {
                                    newAnswerDiv.addEventListener("mouseup", () =>
                                    {
                                        if(!correctClicked){
                                        newAnswerDiv.style.backgroundColor = "rgba(85, 193, 3, 1)";
                                        newAnswerDiv.style.cursor = "default";
                                        if(countCorrect--)
                                        {
                                            if(!countCorrect)
                                            {
                                                countCorrectText.textContent ="Great that's all!";
                                                navIdCorrect.style.backgroundColor="rgba(85, 193, 3, 1)";
                                                if(wrongAnswerTable.length)
                                                {
                                                    for(let y = 0; y < wrongAnswerTable.length; y++)
                                                    {
                                                        questionHTML.querySelector(".AnswerDropDivsCointainer").getElementsByTagName("div")[wrongAnswerTable[y]].style.display = "none";
                                                    }
                                                }
                                                if(more=="true")
                                                {
                                                    moreDivSpace.style.display = "block";
                                                    window.scrollTo({
                                                        top: moreDivSpace.offsetTop - navHeight - whatIsSpace.offsetHeight
                                                    });
                                                }
                                            }else
                                                {
                                                    countCorrectText.textContent = countCorrect + " more...";
                                                }
                                            
                                            if(!whatIsSpaceAdded)
                                            {
                                                countCorrectText.classList = "countCorrectText";
                                                whatIsSpace.prepend(countCorrectText);
                                                whatIsSpaceAdded = true;
                                            }
                                        }
                                        correctClicked = true;
                                        }
                                        
                                    });
                                }else
                                {
                                    let randomNumber;
                                    let dontClickAgain = false;
                                    newAnswerDiv.addEventListener("mouseup", () =>
                                    {
                                        if(!dontClickAgain){
                                            randomNumber = Math.floor(Math.random() * 4);
                                            newAnswerDiv.style.backgroundColor = "rgba(255, 41, 41, 0.8)";
                                            switch(randomNumber)
                                            {
                                                case 0:
                                                    newAnswerDiv.textContent = "Ups ;)";
                                                    break;
                                                case 1:
                                                    newAnswerDiv.textContent = "Nooo!";
                                                    break;
                                                case 2:
                                                    newAnswerDiv.textContent = "Another one!";
                                                    break;
                                                case 3:
                                                    newAnswerDiv.textContent = "Oh...";
                                                    break;

                                            }
                                        }
                                        dontClickAgain = true;
                                    });
                                }
                            } 
                        }
                    }
                }
            }
            else
            {
                console.error("It was not possible to load the data!");
            }
        }
        xhr.send();
};
function isTouch() 
{
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}
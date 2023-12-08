const fs = require('fs');
const readlineSync = require('readline-sync');
const path = require('path');



const examsFolder = './Examen';

function navigateQuestions() {
    console.log('Naviguer dans la base de données des questions');
    try {
        const demanderNomFichierExamen = require('./Naviguer');
    } catch (error) {
        console.error('Erreur lors de la redirection vers Naviguer.js :', error.message);
        showMenu();
    }
}

function composeExam() {
    console.log('Composer un examen.');
    try {
        const demanderNomFichierExamen = require('./ChooseQuestion');
    } catch (error) {
        console.error('Erreur lors de la redirection vers ChooseQuestion.js :', error.message);
        showMenu();
    }
}

function formatQuestion(question) {
    return `${question.title}\n${question.stem.text}\n`;
}

function passExam(examName) {
    const examPath = path.join(examsFolder, examName);

    try {
        const examData = JSON.parse(fs.readFileSync(examPath, 'utf8'));
        const questions = examData.questions;
        let score=0;
        let scoreMax=0;
        console.log(`Questions de l'examen "${examName}":`);
        questions.forEach((question, index) => {
            let correctAnswers = [];
            console.log(`Question ${index+1} :`);
            console.log(question.stem.text);
            let typeOfQuestion = typeQuestion(question);

            switch(typeOfQuestion) {
                case 'MC':
                    
                    console.log('\n Il s\'agit d\'un QCM.\n Voici les propositions de reponse :')
                    question.choices.forEach((proposition,i) => {
                        console.log(i+1+" - "+proposition.text.text);
                        if(proposition.isCorrect==true){
                            correctAnswers.push(i+1);
                        }
                    });
                    break;

                case 'Short':
                    question.choices.forEach((proposition) => {
                        correctAnswers.push(proposition.text.text);
                    });
                    break;

                case 'Description':
                    console.log('C etait la description de l exercice.');
                    break;

                case 'Matching':
                    let firstElement = [];
                    let secondElement = [];
                    console.log(question);
                    question.matchPairs.forEach((proposition,i)=> {
                        firstElement.push(proposition.subquestion.text);
                        secondElement.push(proposition.subanswer);
                    });
                    console.log(firstElement);
                    console.log(secondElement);
                    let numAnswerMatch;
                    let answerMatching = [];
                    let indice;
                    firstElement.forEach((firstEl,j) => {
                        if(firstEl!=0){
                            console.log("A quoi correspond \""+firstEl+"\" ?");
                        }
                        
                        secondElement.forEach((secondEl,k) => {
                            if(secondEl!=0){
                                console.log(k+1+" - "+secondEl);
                            }
                            indice=k;
                        });
                        numAnswerMatch = readlineSync.question('\nQuelle est votre reponse ? (Repondez par un chiffre correspondant aux reponses) : ');
                        answerMatching.push([firstEl,secondElement[numAnswerMatch-1]]);
                        
                        firstElement[j]=0;
                        secondElement[indice]=0;
                        console.log(answerMatching);
                        console.log(firstElement);
                    });

                    break;
            }

            
            if(typeOfQuestion!='Description' && typeOfQuestion!='Matching'){
                let answer = readlineSync.question('\nQuelle est votre reponse ? (Repondez par un chiffre correspondant aux reponses) : ');
            
                console.log(`Vous avez répondu : ${answer}\n`);
                if(typeOfQuestion=='MC') {
                    answer = parseInt(answer);
                }
                if(correctAnswers.includes(answer)){
                    console.log("Bonne reponse ! Bravo !\n");
                    score=score+1;
                }
                scoreMax=scoreMax+1;
                
            }   
            if(typeOfQuestion=='Matching'){
                let correctAnswerMatching = [];
                question.matchPairs.forEach((proposition,i)=> {
                    correctAnswerMatching.push([proposition.subquestion.text,proposition.subanswer])
                });

                if(answerMatching==correctAnswerMatching){
                    score=score+answerMatching.length();
                }
                scoreMax=scoreMax+answerMatching.length();
            }
            
        });
        console.log(`Vous avez obtenu le score de ${score} sur ${scoreMax} à ce test.`);

    } catch (error) {
        console.error('Erreur lors de la lecture de l\'examen :', error.message);
    }

    showMenu();
}

function typeQuestion(question){
    switch (question.type){
        case 'Short':
            retour='Short';
            break;
        
        case 'MC':
            retour='MC';
            break;

        case 'Description':
            retour='Description';
            break;

        case 'Matching':
            retour='Matching';7
            break;
    }
    
    return retour;
}

function viewQuestionsInExam(examName) {
    const examPath = path.join(examsFolder, examName);

    try {
        const examData = JSON.parse(fs.readFileSync(examPath, 'utf8'));
        const questions = examData.questions;

        console.log(`Questions de l'examen "${examName}":`);
        questions.forEach((question, index) => {
            console.log(`${index + 1}. ${formatQuestion(question)}`);
        });
    } catch (error) {
        console.error('Erreur lors de la lecture de l\'examen :', error.message);
    }

    showMenu();
}

function viewExams() {
    const examFiles = fs.readdirSync(examsFolder);
    console.log('Examens existants :');
    examFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
    });

    const choice = readlineSync.question('Choisissez un examen (ou tapez 0 pour revenir) : ');

    if (choice === '0') {
        showMenu();
    } else {
        const chosenIndex = parseInt(choice) - 1;
        if (chosenIndex >= 0 && chosenIndex < examFiles.length) {
            const chosenExam = examFiles[chosenIndex];
            viewQuestionsInExam(chosenExam);
        } else {
            console.log('Choix invalide. Veuillez choisir un numéro valide.');
            viewExams();
        }
    }
}


function simulateExam() {
    const examFiles = fs.readdirSync(examsFolder);
    console.log('Quel examen souhaitez-vous faire passer ?');
    examFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
    });
    const choice = readlineSync.question('\nChoisissez un examen (ou tapez 0 pour revenir) : ');

    if (choice === '0') {
        showMenu();
    } else {
        const chosenIndex = parseInt(choice) - 1;
        if (chosenIndex >= 0 && chosenIndex < examFiles.length) {
            const chosenExam = examFiles[chosenIndex];

            console.log("C'est parti pour l'examen " + choice);
            
            passExam(chosenExam);
        } else {
            console.log('Choix invalide. Veuillez choisir un numéro valide.');
            viewExams();
        }
    }
}


function showMenu() {
    console.log('\nChoisissez une option :\n1. Naviguer dans les questions\n2. Composer un examen\n3. Voir les examens existants\n4. Simuler la passation d\'un examen\n5. Quitter\n');
    
    const choice = readlineSync.question('Votre choix : ');

    switch (choice) {
        case '1':
            navigateQuestions();
            break;
        case '2':
            composeExam();
            break;
        case '3':
            viewExams();
            break;
        case '4':
            simulateExam();
            break;
        case '5':
            console.log('Au revoir!');
            break;
        default:
            console.log('Option invalide. Veuillez choisir une option valide.');
            showMenu();
            break;
    }
}

showMenu(); //PENSER A SUPPRIMER QUAND ON VEUT OBLIGER A PASSER PAR LE LOGIN
module.exports = { showMenu };
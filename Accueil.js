const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

    rl.question('Choisissez un examen (ou tapez 0 pour revenir) : ', (choice) => {
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
    });
}

function simulateExam() {
    console.log('Simuler la passation d\'un examen (fonctionnalité à implémenter).');
    showMenu();
}

function showMenu() {
    rl.question(
        'Choisissez une option :\n1. Naviguer dans les questions\n2. Composer un examen\n3. Voir les examens existants\n4. Simuler la passation d\'un examen\n5. Quitter\n',
        (choice) => {
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
                    rl.close();
                    break;
                default:
                    console.log('Option invalide. Veuillez choisir une option valide.');
                    showMenu();
                    break;
            }
        }
    );
}

showMenu();

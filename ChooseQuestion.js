// 1.Demander à l'utilisateur dans quelle Unité il veut choisir sa question (U1,U2...dans le début du nom des files)
// 2.Afficher toutes les questions présentes dans l'unité
// 3.Demander à l'utilisateur l'ID de la question qu'il veut sélectionner
// 4.Garder l'ID en mémoire et lui demander si il veut choisir une autre question dans la même unité, dans une autre unité ou si il a fini de choisir
// Selon sa réponse, retourner à l'étape 1, ou 2, ou terminer

const fs = require('fs');
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const examen = { questions: [] };
const MAX_QUESTIONS = 20;
const MIN_QUESTIONS = 15;

let nomFichierExamen; // Variable pour stocker le nom du fichier d'examen

function demanderNomFichierExamen() {
    readline.question("Entrez le nom que vous souhaitez donner au fichier d'examen (sans extension) : ", (nomFichier) => {
        nomFichierExamen = nomFichier + '.json';
        demanderUnite();
    });
}

function afficherQuestions(unit) {
    const dossier = 'JsonFile';
    const fichiers = fs.readdirSync(dossier).filter(fichier => fichier.endsWith('.json') && fichier.includes(unit));

    let questionNumber = 1;
    const questions = [];

    fichiers.forEach(fichier => {
        const cheminFichier = path.join(dossier, fichier);
        const data = JSON.parse(fs.readFileSync(cheminFichier, 'utf-8'));

        console.log(`\nQuestions dans le fichier ${fichier} :`);
        data.forEach(item => {
            if ('title' in item && item['title'] && item['title'].includes(unit)) {
                console.log(`${questionNumber}. ${item['title']}`);
                if ('stem' in item && 'text' in item['stem']) {
                    console.log(`   ${item['stem']['text']}`);
                }
                questions.push(item);
                questionNumber++;
            }
        });
    });

    return questions;
}

function creerExamen(question) {
    examen.questions.push(question);
    if (examen.questions.length >= MAX_QUESTIONS) {
        console.log(`L'examen a atteint le nombre maximal de questions (${MAX_QUESTIONS}). Terminaison automatique.`);
        terminerExamen();
    } else {
        console.log('\nQuestion ajoutée à l\'examen.');
        lireOption(afficherQuestions(unitChoisie));
    }
}

function lireOption(questions) {
    console.log("\nQue souhaitez-vous faire ?");
    console.log("1. Choisir une question dans la même unité");
    console.log("2. Choisir une question dans une autre unité");
    console.log("3. Terminer");

    readline.question('Choisissez l\'option correspondante (1, 2, 3) : ', (reponse) => {
        if (reponse === '1') {
            choisirQuestionMemeUnite(unitChoisie);
        } else if (reponse === '2') {
            demanderUnite();
        } else if (reponse === '3') {
            if (examen.questions.length < MIN_QUESTIONS) {
                console.log(`L'examen doit comporter au moins ${MIN_QUESTIONS} questions. Ajoutez plus de questions.`);
                lireOption(questions);
            } else {
                console.log(`\nExamen terminé. Consultez le fichier ${nomFichierExamen}.`);
                terminerExamen();
            }
        } else {
            console.log('Option invalide. Veuillez choisir une option valide.');
            lireOption(questions);
        }
    });
}

function choisirQuestionMemeUnite(unit) {
    const questions = afficherQuestions(unit);
    if (questions.length > 0) {
        readline.question('Veuillez entrer le numéro de la question que vous souhaitez sélectionner : ', (numero) => {
            const numeroQuestion = parseInt(numero);
            if (numeroQuestion >= 1 && numeroQuestion <= questions.length) {
                const questionChoisie = questions[numeroQuestion - 1];
                if (!questionDejaSelectionnee(questionChoisie)) {
                    creerExamen(questionChoisie);
                } else {
                    console.log('Cette question a déjà été sélectionnée. Veuillez choisir une autre question.');
                    choisirQuestionMemeUnite(unit);
                }
            } else {
                console.log('Numéro de question invalide. Veuillez choisir un numéro de question valide.');
                choisirQuestionMemeUnite(unit);
            }
        });
    } else {
        console.log('Aucune question trouvée pour cette unité.');
        lireOption([]);
    }
}

function questionDejaSelectionnee(question) {
    return examen.questions.some(q => q.title === question.title && q.stem.text === question.stem.text);
}

function demanderUnite() {
    readline.question("Veuillez entrer le numéro de l'unité (U1, U2, ...U11) ou 'fini' pour terminer : ", (userUnit) => {
        if (userUnit.toLowerCase() === 'fini') {
            console.log(`\nExamen terminé. Consultez le fichier ${nomFichierExamen}.`);
            terminerExamen();
        } else if (/^U[1-9]|1[0-1]$/.test(userUnit)) {
            unitChoisie = userUnit;
            choisirQuestionMemeUnite(unitChoisie);
        } else {
            console.log('Numéro d\'unité invalide. Veuillez entrer un numéro d\'unité entre U1 et U11.');
            demanderUnite();
        }
    });
}

function terminerExamen() {
    const examenJSON = JSON.stringify(examen, null, 2);
    fs.writeFileSync(nomFichierExamen, examenJSON);
    readline.close();
}

demanderNomFichierExamen();  // Appel initial pour demander le nom du fichier d'examen

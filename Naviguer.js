const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function afficherQuestions(unit) {
    const dossier = 'JsonFile';
    const fichiers = fs.readdirSync(dossier).filter(fichier => fichier.endsWith('.json') && fichier.includes(unit));

    let questionNumber = 1;

    fichiers.forEach(fichier => {
        const cheminFichier = path.join(dossier, fichier);
        const data = JSON.parse(fs.readFileSync(cheminFichier, 'utf-8'));

        console.log(`\nQuestions dans le fichier ${fichier} pour l'unité ${unit}:`);
        data.forEach(item => {
            if ('title' in item && item['title'] && item['title'].includes(unit)) {
                console.log(`${questionNumber}. ${item['title']}`);
                if ('stem' in item && 'text' in item['stem']) {
                    console.log(`   ${item['stem']['text']}`);
                }
                questionNumber++;
            }
        });
    });

    if (questionNumber === 1) {
        console.log('Aucune question trouvée pour cette unité.');
    }
}

function choisirUnitEtAfficherQuestions() {
    readline.question("Veuillez entrer le numéro de l'unité (U1, U2, ...U11) ou 'fini' pour quitter : ", (userUnit) => {
        if (userUnit.toLowerCase() === 'fini') {
            console.log('Au revoir!');
            readline.close();
        } else if (/^U[1-9]|1[0-1]$/.test(userUnit)) {
            afficherQuestions(userUnit);
            choisirUnitEtAfficherQuestions();
        } else {
            console.log('Numéro d\'unité invalide. Veuillez entrer un numéro d\'unité entre U1 et U11.');
            choisirUnitEtAfficherQuestions();
        }
    });
}

choisirUnitEtAfficherQuestions();
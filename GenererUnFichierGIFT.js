//SPEC 3

// Fonction qui génère le contenu GIFT à partir d'un nom d'examen et d'un tableau de questions
function genererFichierGIFT(nomExamen, questions) {
    // Initialise le contenu GIFT avec le nom de l'examen
    let giftContent = `# ${nomExamen}\n\n`;

    // Parcourt chaque question et génère le contenu GIFT
    questions.forEach((question, index) => {
        // Ajoute le titre de la question avec son numéro
        giftContent += `::Question ${index + 1}:: ${question}\n`;

        // Ajoute des options de réponse (ici, A, B, C) - vous pouvez adapter selon vos besoins
        giftContent += `A. Réponse 1\n`;
        giftContent += `B. Réponse 2\n`;
        giftContent += `C. Réponse 3\n\n`;
    });

    // Vous pouvez ajouter d'autres détails comme la durée, la date, etc.

    // Retourne le contenu GIFT généré
    return giftContent;
}

// Exemple d'utilisation de la fonction avec un nom d'examen et un tableau de questions
const nomExamen = "Examen de JavaScript";
const questions = ["Quelle est la capitale de la France?", "Quel est le langage de programmation JavaScript?"];

// Appelle la fonction pour générer le contenu GIFT
const giftContent = genererFichierGIFT(nomExamen, questions);

// Affiche le contenu généré dans la console
console.log(giftContent);

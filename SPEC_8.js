// Fonction pour analyser une chaîne GIFT et retourner un objet représentant la question
function parseGiftQuestion(giftString) {
    // Initialisation de l'objet de la question avec des propriétés par défaut
    const questionObject = {
        type: "",          // Type de question (à adapter selon les types supportés par Moodle)
        text: "",          // Texte de la question
        options: [],       // Options de réponse
        correctAnswers: [] // Réponses correctes
    };

    // Division de la chaîne GIFT en lignes et suppression des espaces inutiles
    const lines = giftString.split("\n").map(line => line.trim());

    // Extraction du texte de la question à partir de la première ligne
    questionObject.text = lines[0].trim();

    // Analyse des options de réponse et des réponses correctes à partir des lignes suivantes
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // Vérification si la ligne commence par "{" et se termine par "}"
        if (line.startsWith("{") && line.endsWith("}")) {

            // Vérification des réponses correctes (si la ligne contient "=")
            if (line.includes("=")) {
                // Ajout de l'option à la liste des réponses correctes
                questionObject.correctAnswers.push(option);
            }

            // Extraction de l'option de réponse sans les crochets "{}" et ajout à la liste des options
            const option = line.substring(1, line.length - 1).trim();
            questionObject.options.push(option);
        }
    }

    // Détermination du type de question en fonction du nombre de réponses correctes
    questionObject.type = determineQuestionType(questionObject);

    // Retourne l'objet représentant la question
    return questionObject;
}

// Fonction utilitaire pour déterminer le type de question
function determineQuestionType(questionObject) {
    // Nombre de réponses correctes
    const numCorrectAnswers = questionObject.correctAnswers.length;

    if (numCorrectAnswers === 1) {
        // Question à choix unique
        return "singlechoice";
    } else if (numCorrectAnswers > 1) {
        // Question à choix multiples
        return "multichoice";
    } else {
        // Aucune réponse correcte spécifiée, par défaut, on pourrait considérer une question vrai/faux
        return "truefalse";
    }
}

// Exemple d'utilisation de la fonction pour analyser une question GIFT
const giftString = "Quelle est la capitale de la France?\n{Paris}\n{Londres}\n{Berlin}\n=Paris";
const parsedQuestion = parseGiftQuestion(giftString);

// Affichage de l'objet représentant la question dans la console
console.log(parsedQuestion);

// Vérification du nombre de réponses correctes et retour du type de question
if (parsedQuestion.correctAnswers.length <= 1) {
    return "singlechoice";
} else {
    return "multichoice";
}


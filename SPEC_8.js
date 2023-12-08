function parseGiftQuestion(giftString) {
    const questionObject = {
        type: "", // Type de question (à adapter selon les types supportés par Moodle)
        text: "", // Texte de la question
        options: [], // Options de réponse
        correctAnswers: [] // Réponses correctes
    };

    const lines = giftString.split("\n").map(line => line.trim());

    // Extraction du texte de la question
    questionObject.text = lines[0].trim();

    // Analyse des options de réponse et des réponses correctes
    for (let i = 1; i < lines.length; i++) {

        const line = lines[i];
        if (line.startsWith("{") && line.endsWith("}")) {


            // Vérification des réponses correctes
            if (line.includes("=")) {
                questionObject.correctAnswers.push(option);
            }

            // Option de réponse
            const option = line.substring(1, line.length - 1).trim();
            questionObject.options.push(option);

        }
    }

    // Détermination du type de question
    questionObject.type = determineQuestionType(questionObject);

    return questionObject;
}

// Fonction utilitaire pour déterminer le type de question
function determineQuestionType(questionObject) {
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

// Exemple d'utilisation
    const giftString = "Quelle est la capitale de la France?\n{Paris}\n{Londres}\n{Berlin}\n=Paris";
    const parsedQuestion = parseGiftQuestion(giftString);
    console.log(parsedQuestion);
if (questionObject.correctAnswers.length <= 1) {
    return "singlechoice";
} else {
    return "multichoice";

}

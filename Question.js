// Définition d'une fonction constructeur Question
var Question = function (titre, consigne, question, proposition) {
    // Propriété pour stocker le titre de la question
    this.titre = titre;
    // Propriété pour stocker la consigne de la question
    this.consigne = consigne;
    // Propriété pour stocker le texte de la question
    this.question = question;
    // Propriété pour stocker les propositions de réponse
    this.proposition = proposition;
}

// La fonction constructeur Question est utilisée pour créer des objets de type Question
// Chaque objet créé aura les propriétés titre, consigne, question, et proposition
// Ces propriétés seront initialisées avec les valeurs fournies lors de la création d'un nouvel objet Question.


//SPEC 3

function genererFichierGIFT(nomExamen, questions) {
    let giftContent = `# ${nomExamen}\n\n`;

    questions.forEach((question, index) => {
        giftContent += `::Question ${index + 1}:: ${question}\n`;
        giftContent += `A. Réponse 1\n`;
        giftContent += `B. Réponse 2\n`;
        giftContent += `C. Réponse 3\n\n`;
    });

    // Vous pouvez ajouter d'autres détails comme la durée, la date, etc.

    return giftContent;
}


const giftContent = genererFichierGIFT(nomExamen, questions);

// Affichez le contenu généré dans la console
console.log(giftContent);


// Voici un exemple d'utilisation avec Node.js

//const fs = require('fs');
//fs.writeFileSync('examen_gift.txt', giftContent, 'utf-8');

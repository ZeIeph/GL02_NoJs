//  Fonction pour lire les fichiers ; boucle pour naviguer de fichier en fichier
// Boucle pour lire le fichier ligne par ligne (mettre le texte dans une variable)
// Parser le fichier et créer un file pour le mettre dedans
// Passer au fichier d'après


const fs = require('fs');
const path = require('path');
const Parser = require("gift-parser-ide").default;

// Chemin du répertoire contenant les fichiers GIFT
const directoryPath = 'SujetB_data';
//const directoryPath = '.';

// Crée un dossier "JsonFile" s'il n'existe pas déjà
const outputDirectory = path.join('JsonFile');
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

// Liste des fichiers dans le répertoire
const files = fs.readdirSync(directoryPath);

// Assurez-vous que la variable files est définie et n'est pas null
if (files && files.length > 0) {

    // Fonction pour lire et parser un fichier GIFT
    function processFile(filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Parse le fichier GIFT avec gift-parser
        const parser = new Parser();
        const newFileContent=fileContent.replaceAll("~=","=");
        const parsedData = parser.update(newFileContent).parseOnly(newFileContent);
        

        // Crée un nouveau fichier dans le dossier "JsonFile" pour stocker le résultat
        const outputFileName = path.basename(filePath, '.gift') + '_parsed.json';
        const outputFilePath = path.join(outputDirectory, outputFileName);
        fs.writeFileSync(outputFilePath, JSON.stringify(parsedData, null, 2), 'utf8');
    }

    // Boucle pour parcourir chaque fichier dans le répertoire
    files.forEach(file => {
        // Vérifie si le fichier a l'extension .gift
        if (file.endsWith('.gift')) {
            const filePath = path.join(directoryPath, file);

            // Appelle la fonction pour lire et parser le fichier
            processFile(filePath);
        }
    });
} else {
    console.error('Aucun fichier trouvé dans le répertoire.');
}



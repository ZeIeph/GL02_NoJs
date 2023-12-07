const readline = require('readline-sync');
const fs = require('fs');

const { showMenu } = require('./Accueil');

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/

let users = [];



// Charger les utilisateurs à partir du fichier (s'il existe)
try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
} catch (err) {
    console.log('Aucun fichier d\'utilisateurs trouvé. Création d\'un nouveau fichier.');
}

function saveUsersToFile() {
    // Sauvegarder les utilisateurs dans le fichier
    fs.writeFileSync('users.json', JSON.stringify(users), 'utf8');
}

function createUser() {
    let username = readline.question('Choisissez un pseudo : ');

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        console.log('Ce pseudo est déjà pris. Veuillez choisir un autre.');
        createUser(); // Redemande un pseudo
    } else {
        let password = readline.question('Choisissez un mot de passe : ', {
            hideEchoBack: true, // Hide user input
        });

        users.push({ username, password });
        console.log('Compte créé avec succès!');
        saveUsersToFile();
        showMenuConnexion();
    }
}


function loginUser() {
    let username = readline.question('Entrez votre pseudo : ');
    let password = readline.question('Entrez votre mot de passe : ');

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        console.log('Connexion réussie!');
        redirectToAccueil();
    } else {
        console.log('Échec de la connexion. Vérifiez vos informations.');
        showMenuConnexion();
    }
}

function redirectToAccueil() {
    try {
        showMenu();
    } catch (error) {
        console.error('Erreur lors de la redirection vers Accueil.js :', error.message);
        showMenuConnexion();
    }
}



function showMenuConnexion() {
    let choice = readline.question('Choisissez une option:\n1. Créer un compte\n2. Se connecter\n3. Quitter\n');

    switch (choice) {
        case '1':
            createUser();
            break;
        case '2':
            loginUser();
            break;
        case '3':
            console.log('Au revoir!');
            saveUsersToFile(); // Sauvegarder les utilisateurs avant de quitter
            break;
        default:
            console.log('Option invalide. Veuillez choisir une option valide.');
            showMenuConnexion();
            break;
    }
}


// Afficher le menu principal
showMenuConnexion();



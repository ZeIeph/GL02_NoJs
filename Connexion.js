const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
    rl.question('Choisissez un pseudo : ', (username) => {
        // Vérifier si le pseudo est déjà utilisé
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            console.log('Ce pseudo est déjà pris. Veuillez choisir un autre.');
            createUser(); // Redemande un pseudo
        } else {
            rl.question('Choisissez un mot de passe : ', (password) => {
                // Stocker les informations de l'utilisateur
                users.push({ username, password });
                console.log('Compte créé avec succès!');
                saveUsersToFile();
                showMenu();
            });
        }
    });
}


function loginUser() {
    rl.question('Entrez votre pseudo : ', (username) => {
        rl.question('Entrez votre mot de passe : ', (password) => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                console.log('Connexion réussie!');
                redirectToAccueil();
            } else {
                console.log('Échec de la connexion. Vérifiez vos informations.');
                showMenu();
            }
        });
    });
}

function redirectToAccueil() {
    try {
        const accueilModule = require('./Accueil');
    } catch (error) {
        console.error('Erreur lors de la redirection vers Accueil.js :', error.message);
        showMenu();
    }
}

function showMenu() {
    rl.question('Choisissez une option:\n1. Créer un compte\n2. Se connecter\n3. Quitter\n', (choice) => {
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
                rl.close();
                break;
            default:
                console.log('Option invalide. Veuillez choisir une option valide.');
                showMenu();
                break;
        }
    });
}

// Afficher le menu principal
showMenu();



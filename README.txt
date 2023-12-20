Le projet consiste en un utilitaire permettant d'accéder à une banque de question de manière à pouvoir créer un examen, le passer et le consulter le tout en invite de commande. Le projet en est à la phase numéro 2, l'implémentation. Les commandes : 
npm install gift-parser-ide (qui s'utilise selon la commande node Parser.js)
node Parser.js
npm install prompt-sync
npm install vcards-js --save
npm install readline-sync
sont nécessaires pour pouvoir utiliser l'application, il faut lancer correctement cet utilitaire. Pour lancer cer la commande node Connexion.js

Tout n'est malheureusement pas parfait dans notre projet puisque le temps nous a manqué.

Par conséquent, nous n'avons pas pu effectuer les tests unitaires.

Nous commenterons le code afin qu'il soit plus lisible pour vous.

Pour ce qui est des SPECS, les SPECS 1,2,3,5 fonctionnent très bien et les SPECS 4,5 et 8 ont été commencées mais pas terminées.

Le Parser fonctionne sur la plupart des fichiers GIFT, cependant certains possédant des irrégularités ne peuvent pas être traduits en Json par le Parser (voir Fichiers_Incompatibles).

N'hésitez surtout pas à poser des questions si besoin.

Cordialement, Nathan Boutevillain, Anne-Lise Knecht, Milo Marchand et Nicolas Rigolat.

test de push
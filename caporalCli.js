// Importation de modules externes
const fs = require('fs'); // Module pour travailler avec le système de fichiers
const colors = require('colors'); // Module pour colorer la sortie console
const VpfParser = require('./VpfParser.js'); // Module VpfParser personnalisé pour analyser les fichiers Vpf

const vg = require('vega'); // Module Vega pour la création de visualisations
const vegalite = require('vega-lite'); // Module Vega-Lite pour la création de visualisations

const cli = require("@caporal/core").default; // Module Caporal pour la création d'une interface en ligne de commande

// Configuration de la version de l'interface en ligne de commande
cli
	.version('vpf-parser-cli')
	.version('0.07')

	// Commande pour vérifier si un fichier est un fichier Vpf valide
	.command('check', 'Check if <file> is a valid Vpf file')
	.argument('<file>', 'The file to check with Vpf parser')
	.option('-s, --showSymbols', 'log the analyzed symbol at each step', { validator: cli.BOOLEAN, default: false })
	.option('-t, --showTokenize', 'log the tokenization results', { validator: cli.BOOLEAN, default: false })
	.action(({ args, options, logger }) => {

		// Lecture du contenu du fichier
		fs.readFile(args.file, 'utf8', function (err, data) {
			if (err) {
				return logger.warn(err);
			}

			// Création d'une instance de VpfParser
			var analyzer = new VpfParser(options.showTokenize, options.showSymbols);
			// Analyse du contenu du fichier avec le VpfParser
			analyzer.parse(data);

			// Affichage du résultat de l'analyse
			if (analyzer.errorCount === 0) {
				logger.info("The .vpf file is a valid vpf file".green);
			} else {
				logger.info("The .vpf file contains error".red);
			}

			// Affichage du contenu analysé (debug)
			logger.debug(analyzer.parsedPOI);

		});

	})

	// Commande pour afficher le contenu du fichier README.txt
	.command('readme', 'Display the README.txt file')
	.action(function (args, options, logger) {
		// Lecture du contenu du fichier README.txt
		fs.readFile('./README.txt', "utf-8", function (err, data) {
			if (err) {
				return logger.warn(err);
			}
			// Affichage du contenu du fichier README.txt
			console.log(data);
		})
	})

	// Commande pour effectuer une recherche de texte libre dans les noms de POIs
	.command('search', 'Free text search on POIs\' name')
	.argument('<file>', 'The Vpf file to search')
	.argument('<needle>', 'The text to look for in POI\'s names')
	.action(({ args, options, logger }) => {
		// Lecture du contenu du fichier
		fs.readFile(args.file, 'utf8', function (err, data) {
			if (err) {
				return logger.warn(err);
			}

			// Création d'une instance de VpfParser
			analyzer = new VpfParser();
			// Analyse du contenu du fichier avec le VpfParser
			analyzer.parse(data);

			// Affichage du résultat de l'analyse
			if (analyzer.errorCount === 0) {
				// Filtrer les POIs dont le nom correspond à l'aiguille de recherche
				console.log(args.needle);
				console.log();
				console.log(analyzer.parsedPOI.filter((word) => word == args.needle));
			} else {
				logger.info("The .vpf file contains error".red);
			}

		});
	})

	// Commande pour calculer la note moyenne de chaque POI (commentée car non implémentée)
	// .command('average', 'Compute the average note of each POI')
	// .alias('avg')

	// Commande pour calculer la note moyenne de chaque POI et exporter un graphique Vega-lite
	.command('averageChart', 'Compute the average note of each POI and export a Vega-lite chart')
	.alias('avgChart')
	.argument('<file>', 'The Vpf file to use')
	.action(({ args, options, logger }) => {
		// Lecture du contenu du fichier
		fs.readFile(args.file, 'utf8', function (err, data) {
			if (err) {
				return logger.warn(err);
			}

			// Création d'une instance de VpfParser
			analyzer = new VpfParser();
			// Analyse du contenu du fichier avec le VpfParser
			analyzer.parse(data);

			// Si l'analyse est réussie
			if (analyzer.errorCount === 0) {

				// ToDo: Préparer les données pour la moyenne
				// let avg = <un tableau de POI ayant un attribut "averageRatings" égal à la moyenne des notes qu'il a reçu>

				// Configuration du graphique Vega-lite
				var avgChart = {
					//"width": 320,
					//"height": 460,
					"data": {
						"values": avg
					},
					"mark": "bar",
					"encoding": {
						"x": {
							"field": "name",
							"type": "nominal",
							"axis": { "title": "Restaurants' name." }
						},
						"y": {
							"field": "averageRatings",
							"type": "quantitative",
							"axis": { "title": "Average ratings for " + args.file + "." }
						}
					}
				}

				// Compilation du graphique Vega-lite
				const myChart = vegalite.compile(avgChart).spec;

				/* Version SVG */
				var runtime = vg.parse(myChart);
				var view = new vg.View(runtime).renderer('svg').run();
				var mySvg = view.toSVG();
				mySvg.then(function (res) {
					// Écriture du fichier SVG résultant
					fs.writeFileSync("./result.svg", res)
					view.finalize();
					logger.info("%s", JSON.stringify(myChart, null, 2));
					logger.info("Chart output : ./result.svg");
				});

				/* Version Canvas */
				/*
                var runtime = vg.parse(myChart);
                var view = new vg.View(runtime).renderer('canvas').background("#FFF").run();
                var myCanvas = view.toCanvas();
                myCanvas.then(function(res){
                    // Écriture du fichier PNG résultant
                    fs.writeFileSync("./result.png", res.toBuffer());
                    view.finalize();
                    logger.info(myChart);
                    logger.info("Chart output : ./result.png");
                })
                */


			} else {
				logger.info("The .vpf file contains error".red);
			}

		});
	})

// Exécution de l'interface en ligne de commande avec les arguments du processus
cli.run(process.argv.slice(2));

	
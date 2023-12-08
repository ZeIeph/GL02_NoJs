// Importation du module POI
var POI = require('./POI');

// VpfParser
var VpfParser = function(sTokenize, sParsedSymb){
	// La liste des POI analysés à partir du fichier d'entrée.
	this.parsedPOI = [];
	// Les symboles de la grammaire VPF
	this.symb = ["START_POI","name","latlng","note","END_POI","$$"];
	// Indique si les étapes de tokenization doivent être affichées
	this.showTokenize = sTokenize;
	// Indique si les symboles analysés doivent être affichés
	this.showParsedSymbols = sParsedSymb;
	// Compteur d'erreurs de parsing
	this.errorCount = 0;
}

// Procédure de l'analyseur

// tokenize : transforme les données d'entrée en une liste de jetons
// <eol> = CRLF
VpfParser.prototype.tokenize = function(data){
	var separator = /(\r\n|: )/;
	data = data.split(separator);
	data = data.filter((val, idx) => !val.match(separator));
	return data;
}

// parse : analyse les données en appelant la première règle non terminale de la grammaire
VpfParser.prototype.parse = function(data){
	var tData = this.tokenize(data);
	if(this.showTokenize){
		console.log(tData);
	}
	this.listPoi(tData);
}

// Opérations de l'analyseur

// errMsg : affiche un message d'erreur de parsing
VpfParser.prototype.errMsg = function(msg, input){
	this.errorCount++;
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

// next : lit et retourne un symbole à partir de l'entrée
VpfParser.prototype.next = function(input){
	var curS = input.shift();
	if(this.showParsedSymbols){
		console.log(curS);
	}
	return curS
}

// accept : vérifie si l'argument s fait partie des symboles du langage
VpfParser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// L'index 0 existe
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}
	return idx;
}

// check : vérifie si l'élément arg est en tête de la liste
VpfParser.prototype.check = function(s, input){
	if(this.accept(input[0]) == this.accept(s)){
		return true;
	}
	return false;
}

// expect : attend que le prochain symbole soit s.
VpfParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		//console.log("Recognized! "+s)
		return true;
	}else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}

// Règles de l'analyseur

// <liste_poi> = *(<poi>) "$$"
VpfParser.prototype.listPoi = function(input){
	this.poi(input);
	this.expect("$$", input);
}

// <poi> = "START_POI" <eol> <body> "END_POI"
VpfParser.prototype.poi = function(input){
	if(this.check("START_POI", input)){
		this.expect("START_POI", input);
		var args = this.body(input);
		var p = new POI(args.nm, args.lt, args.lg, []);
		this.note(input, p);
		this.expect("END_POI",input);
		this.parsedPOI.push(p);
		if(input.length > 0){
			this.poi(input);
		}
		return true;
	}else{
		return false;
	}
}

// <body> = <name> <eol> <latlng> <eol> <optional>
VpfParser.prototype.body = function(input){
	var nm = this.name(input);
	var ltlg = this.latlng(input);
	return { nm: nm, lt: ltlg.lat, lg: ltlg.lng };
}

// <name> = "name: " 1*WCHAR
VpfParser.prototype.name = function(input){
	this.expect("name",input)
	var curS = this.next(input);
	if(matched = curS.match(/[\wàéèêîù'\s]+/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}

// <latlng> = "latlng: " ?"-" 1*3DIGIT "." 1*DIGIT", " ?"-" 1*3DIGIT "." 1*DIGIT
VpfParser.prototype.latlng = function(input){
	this.expect("latlng",input)
	var curS = this.next(input);
	if(matched = curS.match(/(-?\d+(\.\d+)?);(-?\d+(\.\d+)?)/)){
		return { lat: matched[1], lng: matched[3] };
	}else{
		this.errMsg("Invalid latlng", input);
	}
}

// <optional> = *(<note>)
// <note> = "note: " "0"/"1"/"2"/"3"/"4"/"5"
VpfParser.prototype.note = function (input, curPoi){
	if(this.check("note", input)){
		this.expect("note", input);
		var curS = this.next(input);
		if(matched = curS.match(/[12345]/)){
			curPoi.addRating(matched[0]);
			if(input.length > 0){
				this.note(input, curPoi);
			}
		}else{
			this.errMsg("Invalid note");
		}
	}
}

// Exportation de la classe VpfParser
module.exports = VpfParser;

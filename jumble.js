var dict;
if(process.argv[3]){
	dict = process.argv[3]
}else{
	dict = "/usr/share/dict/words";
}
jumbleWords(process.argv[2], dict, function(data){
	console.log(JSON.stringify(Object.keys(data)));
});

function jumbleWords(inp, dict, cb){
	var fs = require("fs");
	var alphaWord, wordArray, wordDict = new Object(), wordDictCheck = new Object(), jumbleWords = new Object();
	fs.readFile(dict, "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}
		wordArray = data.toLowerCase().split("\n");
		for(var word in wordArray){
			if(wordArray[word]){
				alphaWord = alphasort(wordArray[word]);
				if(alphaWord){
					if(!wordDict[alphaWord]){
						wordDict[alphaWord] = [];
					}
					if(!wordDictCheck[wordArray[word]]){
						wordDict[alphaWord].push(wordArray[word]);
						wordDictCheck[wordArray[word]] = wordArray[word];
					}
				}
			}
		}
		cb(jumble(alphasort(inp),jumbleWords, wordDict));
	});
}

function jumble(inp, jumbleWords, wordDict){
	if(wordDict[inp]){
		jumbleWords[wordDict[inp]] = wordDict[inp];
	}
	if(inp.length > 1){
		for(var letter in inp.split("")){
			jumbleWords = jumble(inp.substring(0,letter)+inp.substring(letter+1),jumbleWords,wordDict);
		}
	}
	return jumbleWords;
}

function alphasort(word){
	var letters = word.split("");
	var letterDict = new Object();
	for(var letter in letters){
		if((letters[letter].charCodeAt(0)- 97)>=26 || (letters[letter].charCodeAt(0)- 97)<0){
			return null;
		}
		if(!letterDict[letters[letter].charCodeAt(0) - 97]){
			letterDict[letters[letter].charCodeAt(0) - 97 ] = 1;
		}else{
			letterDict[letters[letter].charCodeAt(0) - 97]++;
		}
	}
	var alphaString = new String();
	for(var i =0;i<26;i++){
		if(letterDict[i]){
			for(var j=0;j<letterDict[i];j++){
				alphaString += String.fromCharCode(i+97);
			}
		}
	}
	return alphaString;
}

module.exports.jumbleWords = jumbleWords;

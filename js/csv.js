//console.log("hello CSV");

var recordSet = {}

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
// http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

recordSet.CSVToArray = function( strData, strDelimiter ){
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);

	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;

	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){
		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];
		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)
			){

			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push( [] );

		}
		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			var strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
				);
		} else {
			// We found a non-quoted value.
			var strMatchedValue = arrMatches[ 3 ];
		}


		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}

	// Return the parsed data.
	return( arrData );
}


recordSet.createFilteredSet = function(set, field, value){
	var filteredSet = {};
	filteredSet.fields = set.fields;
	filteredSet.records = [];
	if(field && value){
		for(var i = 0; i < set.records.length; i++){
			if(set.records[i][field] == value){
			     filteredSet.records.push(set.records[i]); 
			}
		}
	}
	return filteredSet;
}

// http://bost.ocks.org/mike/shuffle/
recordSet.shuffle = function(set){
	var m = set.records.length, t, i;
	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);
		// And swap it with the current element.
		t = set.records[m];
		set.records[m] = set.records[i];
		set.records[i] = t;
	}
	return set;	//note, return is perhaps supreflous as the array is sorted in place
}

recordSet.enumerateValues = function(set, field){
	//console.log("enumerateValues");
	//console.log(set.records);
	var valueList = [];
	for(var i = 0; i < set.records.length; i++){
		var currentValue = set.records[i][field];
		if(valueList.indexOf(currentValue) == -1){
		      valueList.push(currentValue);
		}
	}
	return valueList;
}

recordSet.createRecordSet = function(csv){
	var splitCSV = this.CSVToArray(csv);
	//get the first row, this is the fields
	var fields = splitCSV[0];
	//the remaining rows each make one record
	var records = [];
	for (var i = 1; i < splitCSV.length; i++){
		var record = {};
		for (var j = 0; j < fields.length; j++){
			record[ fields[j] ] = splitCSV[i][j];
		}
		records.push(record);
	}
	return {
		fields:fields,
		records:records
	}
}
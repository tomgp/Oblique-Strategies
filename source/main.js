'use strict';
require('babelify/polyfill'); //remove this line if you don't care about ES6 pollyfils
var d3 = {
	request:require('d3-request'),
	select:require('d3-selection').select
};
var request = require('d3-request');
var d3select = require('d3-selection');


d3.request.csv('data/obliquestrategies.csv')
	.get(function(error, data){

		d3.select('article')
			.selectAll('section.card')
			.data(data)
				.enter()
			.append('section').attr('class','card hidden')
				.text(function(d){
					return d.card_text;
				});
	
	});
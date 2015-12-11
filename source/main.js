'use strict';

var d3 = {
	csv:require('d3-request').csv,
	select:require('d3-selection').select
};

d3.csv('data/obliquestrategies.csv')
	.get(function(error, csvData){
		draw(csvData, 5);
	});

function draw(data, displaySet){
	if(displaySet !== undefined) displaySet = 5;

	var filtered = data.filter(function(d){
		return Number(d.edition) === displaySet;
	});

	d3.select('button.random').on('click',function(){
		goTo( Math.floor( Math.random()*filtered.length ) );
	});

	d3.select('button.info').on('click',function(){
		document.getElementById('info').scrollIntoView();
	});


	var dataJoin = d3.select('article')
		.selectAll('section.card')
		.data(filtered);
	
	dataJoin
		.enter()
		.append('section')
		.attr('class','card unselected');
	
	dataJoin
		.attr('id',function(d,i){ return 'card-'+i; })
		.attr('class', function(d,i){
			return 'card unselected';
		})
		.text(function(d){
			if(d.card_text === '[blank white card]') return '';
			return d.card_text;
		});

	goTo( Math.floor( Math.random()*filtered.length ) );
}

function goTo(id){
	var card = d3.select('#card-'+id)
	card.node().scrollIntoView();
	d3.select('article').selectAll('.card').attr('class', function(d,i){
		if(i===id) return 'card selected'
		return 'card unselected';
	})
}
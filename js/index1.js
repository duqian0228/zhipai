$(function(){

	var table={};
	var poker=[];
	var dict={
		1:"A",
		2:2,
		3:3,
		4:4,
		5:5,
		6:6,
		7:7,
		8:8,
		9:9,
		10:'T',
		11:"J",
		12:"Q",
		13:"K"
	}
	while(poker.length !== 52){
		var n=Math.ceil(Math.random()*13);
		var c=Math.floor(Math.random()*4);
		var colors=['h','s','c','d'];
		var cc=colors[c];
		var v={
			number:n,
			color:cc
		}
		if(!table[n+cc]){
			poker.push(v);
			table[n+cc]=true;
		}
	}
	$(poker).each(function(i,v){
		// var index=i;
		$('<div>').addClass('pai')
		   .appendTo('.scene')
		   .css('background-image','url(images/'+dict[v.number]+v.color+'.png)');
	})
	
})

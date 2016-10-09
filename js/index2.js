$(function(){
	function makePoker(){
		var poker=[];
		var table={};	
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
		return poker;
	}
	// var poker=makePoker();
	function setPoker(poker){
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
		var index=0;
		for(var i=0,poke;i<7;i++){
			for(var j=0;j<i+1;j++){
				poke=poker[index];
				index++;
				$('<div>').addClass('pai')
				 .appendTo('.scene')
				 .css({'background-image':'url(images/'+dict[poke.number]+poke.color+'.png)'})
				 .delay(index*50)
				.animate({
					top:i*30,
					left:j*130+(6-i)*65,
					opacity:1
				})
			}
		}
		for(var poke;index<32;index++){
			poke=poker[index];
			index++;
			$('<div>').addClass('pai left')
				 	.appendTo('.scene')
				 	.css({'background-image':'url(images/'+dict[poke.number]+poke.color+'.png)'})
				 	.delay(index*50)
					.animate({
						top:360,
						left:190,
						opacity:1
					})
		}
	}
	setPoker(makePoker())
	var right=$('.scene .move-right');
	var index=1;
	right.on('click',function(){
		if($('.left').length){
			$('.left').last()
			 .css("z-index",index++)
			 .animate({
			  left:690
			 },function(){
			 	$(this).removeClass('left').addClass('right');
			 })
			 // .queue(function(){
				//   $(this).removeClass('left').addClass('right').dequeue();
			 //  })
		}
	})
	var left=$('.scene .move-left');
	var num=0;
	left.on('click',function(){
		if(num<3){
			$('.right').each(function(i,v){
				$(this).delay(i*200)
				.css("z-index",0)
				.animate({
					left:190
				})
				.queue(function(){
					$(this).removeClass('right').addClass('left').dequeue();
				})
			})
			num++;
		}
	})
	
})

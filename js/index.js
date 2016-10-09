$(function(){
	//创建一个poker
	var height=$(window).height();
	$(".scene-bg").css("height",height);
	function makePoker(){
		var poker=[];
		var table={}; //检测poker中的重复元素，如果已有，则不放入，没有就放入，并且在table中添加true，以便检测之后的加入元素	
		while(poker.length !== 52){  //保证poker中放入52张扑克
			var n=Math.ceil(Math.random()*13);  //每张poker的序号 1~13
			var c=Math.floor(Math.random()*4);  //每张poker的花色的下标 0~3
			var colors=['h','s','c','d'];
			var cc=colors[c];     //通过下标随机的选择出poker的花色
			var v={      //新建的每一个poker
				number:n,
				color:cc
			}                     
			if(!table[n+cc]){  //如果poker数组中没有当前的这个v，就加入到poker中，并且在table中添加该v为true，表示这张poker以存在于poker数组中
				poker.push(v);  
				table[n+cc]=true;
			}
		}
		return poker;   //将poker作为函数返回值
	}
	var poker=makePoker();
	//将poker以动画效果放到页面中
	function setPoker(poker){
		var dict={   //dict 用来查询图片名中的number
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
		for(var i=0,poke;i<7;i++){  //28张图片呈金字塔形式在页面中显示
			for(var j=0;j<i+1;j++){
				poke=poker[index];   //通过index选择poker中的每一张poke，然后把该扑克添加到页面中 
				index++;
				$('<div>').addClass('pai').attr('data-number',poke.number)
				 .attr('id',i+'_'+j)
				 .appendTo('.scene')
				 .css({'background-image':'url(images/'+dict[poke.number]+poke.color+'.png)'})
				 .delay(index*50)
				.animate({
					top:i*30,
					left:j*120+(6-i)*60,
					opacity:1
				})
			}
		}
		for(;index<poker.length;index++){
			poke=poker[index];
			$('<div>').addClass('pai left').attr('data-number',poke.number)
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
	setPoker(poker)
	var right=$('.scene .btn-right');
	//闭包  每张牌向右移动
	right.on('click',(function(){
		var index=1;
		return function(){
			if($('.left').length){
			$('.left').last()
			 .css("z-index",index++)
			 .animate({
			  left:535
			 },function(){
			 	$(this).removeClass('left').addClass('right');
			 })
		  }else{
		  	alert("已经是最后一张啦，右面的牌中可能有惊喜哦")
		  }
		}
	})())
	right.on('mouseover',function(){
		$('.right-zhezhao').css('display','block');
		// $(this).css('border-left','')
	})
	right.on('mouseout',function(){
		$('.right-zhezhao').css('display','none');
	})
	var left=$('.scene .btn-left');
	//闭包  所有牌向左移动
	var num=1;
	left.on('click',(function(){
		return function(){
			if($('.left').length){
				alert('继续从左面的牌中寻找，可能有惊喜哦')
			}
			if(num<3&&!$('.left').length){
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
		}
	})())
	left.on('mouseover',function(){
		$('.left-zhezhao').css('display','block');
	})
	left.on('mouseout',function(){
		$('.left-zhezhao').css('display','none');
	})
	//获得每张表的data-number值 1~13
	function getNumber(el){
		return parseInt($(el).attr('data-number'));
	}
	/* isCanClick 这个函数的作用是判断poker是否被其他扑克压着
		id=i_j 的poke被 i+1_j 和 i+1_j+1 这两张图片压着
	*/
	function isCanClick(el){
		var x=parseInt($(el).attr('id').split('_')[0]);  // i值
		var y=parseInt($(el).attr('id').split('_')[1]);  // j值
		//通过length属性来判断i+1_j 和 i+1_j+1 两张图片是否还在如果在，则压在它们下面的图片就不能被点击，则返回false
		if($('#'+(x+1)+'_'+y).length||$('#'+(x+1)+'_'+(y+1)).length){
			return false;
		}else{
			return true;
		}
	}
	var prev=null;
	//事件委派，判断是否是13或两张牌为13，则消失
	$('.scene').on('click','.pai',function(){
		//图片有id且被压着不能被点击，则直接返回
		// $(this).on('dbclick',false)		
		if($(this).attr('id')&&!isCanClick(this)){
			return;
		}
		$(this).animate({'margin-top':-20});
		// $(this).animate({top:'-=20'});
		var btnscore=parseInt($(".btn-score").text());
		var btnremain=parseInt($(".btn-remain").text());
		/*如果点击的是第一张poke，则直接放到变量prev上，如果点击的是第二张poke，则判断之前放到prev上的图片的number与当前this的number的和是否为13，如果是13，则两张一起消失，如果不是，则清除样式*/
		if(prev){
			//prev是第一个，this是第二个
			if(getNumber(prev)+getNumber(this)==13){
				prev.add(this).stop()
				.animate({
					top:-100
				})
				.queue(function(){
					$(this).detach().dequeue();
				})
				$(".btn-score").text(btnscore+=20);
				$(".btn-remain").text(btnremain-=2);
			}else{
				// prev.add(this).delay(400).animate({top:'+=20'})
				$(this).animate({'margin-top':0});
				prev.delay(400).animate({'margin-top':0});
			}
			if(getNumber(prev)==getNumber(this)){
				prev=$(this);
				prev.animate({'margin-top':0})
			}
			prev=null;
		}else{
			prev=$(this)   //prev是获得的第一个
		}
		//如果number为13 点击后直接消失，并且将prev清空
		var number=getNumber(this);
		if(number===13){
			$(this).animate({
				top:-100,
			})
			.queue(function(){
				$(this).detach().dequeue();
			});
			$(".btn-score").text(btnscore+=10);
			$(".btn-remain").text(btnremain-=1);
			prev=null;
			return;
		}
	})
	var start=$('.start');
	start.on('click',function(){
		$('.btn').css('display','block');
		$('.pai').css('display','none')
		setPoker(makePoker())
	})
	var replay=$('.replay');
	replay.on('click',function(){
		$('.btn').css('display','block');
		$('.pai').css('display','none');
		setPoker(makePoker())
	})
	var end=$('.end');
	end.on('click',function(){
		alert('确定结束游戏吗？');
		$('.pai').css('display','none');
		$('.btn').css('display','none');
	})
	
})

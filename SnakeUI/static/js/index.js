jQuery(function(){
	var WORLD = {
		height : 600,
		width : 600,
		cell_width : 10,
		cell_height : 10,
		food : {
			"x" : -1,
			"y" : -1
		}
	}
	WORLD.snake = [
		{
			"x" : WORLD.height/WORLD.cell_height-1,
			"y" : 2
		},
		{
			"x" : WORLD.height/WORLD.cell_height-1,
			"y" : 1
		},
		{
			"x" : WORLD.height/WORLD.cell_height-1,
			"y" : 0
		}
	]
	var MAX_SCORE = 100;
	var STEP_PENALTY = -0.5;
	$arena = jQuery("#arena");
	function confirmFoodLocation(x,y) {
		WORLD.food.x = x; 
		WORLD.food.y = y;
	}
	function setFood($arena, x,y) {
		$cell = $arena.find(".arena-row").eq(x).find(".arena-cell").eq(y);
		if(!$cell.hasClass("blocked")){
			$arena.find(".food").removeClass("food");
			$cell.addClass("food");
			return true;
		}
		return false;
	}
	function confirmSnakeLocation(snake) {
		WORLD.snake = snake;
	}
	function setSnake($arena,snake) {
		$arena.find(".arena-cell.snake").removeClass("snake head");
		$arena.find(".arena-row").eq(snake[0].x).find(".arena-cell").eq(snake[0].y).addClass("snake head");
		for (i = 1 ; i < snake.length ; i++) {
			$arena.find(".arena-row").eq(snake[i].x).find(".arena-cell").eq(snake[i].y).addClass("snake");
		}
	}
	function toggleWall($arena, x, y) {
		$cell = $arena.find(".arena-row").eq(x).find(".arena-cell").eq(y);
		if(!$cell.hasClass("food")){
			$cell.toggleClass("blocked");
			return true;
		}
		return false;
	}
	function serializeWorld($arena) {
		var food = WORLD.food;
		if(food.x == -1 || food.y == -1) {
			return null;
		}
		var world = []
		$rows = $arena.find(".arena-row");
		jQuery.each($rows,function(k,$row){
			var row = []
			$columns = jQuery($row).find(".arena-cell")
			jQuery.each($columns, function(key,$column){
				if(jQuery($column).hasClass("blocked")) {
					row.push(0)
				}
				else {
					row.push(1)
				}
			})
			world.push(row);
		})
		
		var snake = WORLD.snake;
		var direction = "right";
		var x_diff = snake[0].x-snake[1].x;
		var y_diff = snake[0].y-snake[1].y;
		if(x_diff > 0) {
			direction = "down";
		}
		else if(x_diff < 0) {
			direction = "up";
		}
		else {
			if(y_diff > 0) {
				direction = "right";
			}
			else{
				direction = "left";
			}
		}
		var method = $arena.parent().find("#select-method").val()
		return {
			"world" : world,
			"food" : food,
			"snake" : snake[0],
			"direction" : direction,
			"method" : method
		}
	}
	function createArena($arena) {
		$arena.empty();
		$row = jQuery("<div>")
		$row.addClass("arena-row")
		$row.css("height",WORLD.cell_height+"px")
		$cell = jQuery("<div>")
		$cell.addClass("arena-cell")
		$cell.css("width",WORLD.cell_width+"px")
		$cell.css("height",WORLD.cell_height+"px")
		for (w = 0 ; w < WORLD.width/WORLD.cell_width ; w++) {
			$row.append($cell.clone())
		}
		for(h= 0; h < WORLD.height/WORLD.cell_height ; h++) {
			$arena.append($row.clone())
		}
		if(WORLD.food.x != -1 && WORLD.food.y != -1) {
			setFood($arena,WORLD.food.x, WORLD.food.y)
		}
		setSnake($arena, WORLD.snake);
	}
	createArena($arena);
	function hideActionButtons(){ 
		jQuery("#action-bar .action-btns").addClass("hide");
	}
	function showActionButtons() {
		jQuery("#action-bar .action-btns").removeClass("hide");
	}
	function hideConfirmationButtons(){ 
		jQuery("#action-bar .confirmation-btns").addClass("hide");
	}
	function showConfirmationButtons() {
		jQuery("#action-bar .confirmation-btns").removeClass("hide");
	}
	function draw(step) {
	    if(step.position.x == WORLD.food.x && step.position.y == WORLD.food.y) {
	        jQuery("#score").text(Math.max(0,MAX_SCORE+step.cost*STEP_PENALTY))
	        $arena.find(".food").removeClass("food");
	        setFood($arena,-1,-1);
	        confirmFoodLocation(-1,-1);
	    }
		WORLD.snake.unshift(step.position)
		tail = WORLD.snake.pop();
		$arena.find(".arena-row").eq(tail.x).find(".arena-cell").eq(tail.y).addClass("trail");
		setSnake($arena,WORLD.snake)
		jQuery("#steps").text(step.cost)

	}
	function tracePath(path) {
	    jQuery("#arena").find(".trail").removeClass("trail");
	    jQuery("#score").text(0);
		(function myLoop (step) {          
		   setTimeout(function () {   
			  draw(path[path.length-step])
			  if (--step) myLoop(step);
		   }, 50)
		})(path.length-1);
	}
	food_location = {}
	jQuery("#btn-food-setter").click(function(evt){
		hideActionButtons()
		showConfirmationButtons()
		jQuery("#arena").addClass("arena-configure-food")
		jQuery("#arena.arena-configure-food .arena-cell").click(function(evt) {
			y = jQuery(evt.target).index();
			x = jQuery(evt.target).parent().index()
			status = setFood($arena,x,y)
			if(status) {
				food_location = {
					"x" : x,
					"y" : y
				}
			}
		});
	});
	jQuery("#btn-wall-setter").click(function(evt){
		hideActionButtons()
		showConfirmationButtons()
		jQuery("#arena").addClass("arena-configure-wall")
		jQuery("#arena.arena-configure-wall .arena-cell").click(function(evt) {
			y = jQuery(evt.target).index();
			x = jQuery(evt.target).parent().index()
			toggleWall($arena,x,y)
		});
	});
	jQuery("#predefined-worlds .world").click(function(evt) {
	    WORLD.snake = [
            {
                "x" : WORLD.height/WORLD.cell_height-1,
                "y" : 2
            },
            {
                "x" : WORLD.height/WORLD.cell_height-1,
                "y" : 1
            },
            {
                "x" : WORLD.height/WORLD.cell_height-1,
                "y" : 0
            }
        ]
	    createArena($arena);
        config = DEFAULT_WORLDS[jQuery(evt.target).data("id")]
        for (i = 0 ; i < config.length ; i++) {
            for(j = 0 ; j < config[i].length ; j++) {
                $cell = $arena.find(".arena-row").eq(i).find(".arena-cell").eq(j);
                $cell.removeClass("blocked");
                if(config[i][j] == 0) {
                    $cell.addClass("blocked");
                }
            }
        }
	});
	jQuery("#btn-ok").click(function(evt){
		confirmFoodLocation(food_location.x, food_location.y)
		hideConfirmationButtons();
		showActionButtons();
		jQuery("#arena").removeClass("arena-configure-food")
		jQuery("#arena").removeClass("arena-configure-wall")
		jQuery("#arena .arena-cell").off("click");
	})
	jQuery("#btn-cancel").click(function(evt) {
		setFood($arena,WORLD.food.x, WORLD.food.y);
		hideConfirmationButtons();
		showActionButtons();
		jQuery("#arena").removeClass("arena-configure-food")
		jQuery("#arena").removeClass("arena-configure-wall")
		jQuery("#arena .arena-cell").off("click");
	})
	jQuery("#btn-run").click(function(evt){
		data = serializeWorld($arena);
		if(data != null) {
			jQuery.ajax("/solve", {
				"type" : "post",
				"data" : {
					"arena" : JSON.stringify(data)
				}
			}).done(function(response) {
				if(response.status=="success") {
					tracePath(response.solution)
				}
				else if(response.status == "failure") {
					alert(response.message)
				}
			}).fail(function(){
				alert("Sorry! Some error occurred.")
			})
		}
		else {
			alert("Food position not specified.")
		}
	})
});
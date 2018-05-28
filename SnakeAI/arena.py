from copy import copy

class Arena:

	def __init__ (self, _world, _start_point, _food_loc):  
		##
		# world is a 2D array of 0s and 1s
		# 	0 means the location is not accessible 
		# 	1 means # the location is accessible
		##

        ##
        # start_point is a tuple containing the row and column 
        # where the snake would start its search.
        ##

        ##
        # food_loc is a tuple containing the row and column 
        # where the food is located.
        ##
		self.world = _world
		self.food = _food_loc
		self.start = _start_point
		self.shape = (len(_world),len(_world[0]))


	def serialize (self):
		_world = copy(self.world)
		start_x, start_y = self.start
		food_x, food_y = self.food
		_world[start_x][start_y] = 'S'
		_world[food_x][food_y] = 'F'
		return _world
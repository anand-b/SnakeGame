from state import State

class Utils:

    def is_safe(arena, position):
        arena_h, arena_w = arena.shape
        x,y = position
        if(x < 0 or x >= arena_h or y < 0 or y >= arena_w or arena.world[x][y] == 0):
            return False
        return True

    def get_neighbours(arena, state):
        result = list()
        x,y = state.position
        left = (x, y-1)
        right = (x, y+1)
        up = (x-1, y)
        down = (x+1 , y)
        if state.direction == "up":
            result.append(State(right, state, "right", "turn_right", state.cost + 1))
            result.append(State(up, state, "up", "move_forward", state.cost+1))
            result.append(State(left, state, "left", "turn_left", state.cost + 1))
        elif state.direction == "left":
            result.append(State(up, state, "up", "turn_right", state.cost + 1))
            result.append(State(left, state, "left", "move_forward", state.cost + 1))
            result.append(State(down, state, "down", "turn_left", state.cost + 1))
        elif state.direction == "down":
            result.append(State(left, state, "left", "turn_right", state.cost + 1))
            result.append(State(down, state, "down", "move_forward", state.cost + 1))
            result.append(State(right, state, "right", "turn_left", state.cost + 1))
        elif state.direction == "right":
            result.append(State(down, state, "down", "turn_right", state.cost + 1))
            result.append(State(right, state, "right", "move_forward", state.cost + 1))
            result.append(State(up, state, "up", "turn_left", state.cost + 1))

        return result

    def remove_unsafe(arena, neighbors):
        result = list()
        for neighbor in neighbors:
            if(Utils.is_safe(arena, neighbor.position)):
                result.append(neighbor)

        return result

    def get_path(state):
        result = list()
        while (state != None):
            result.insert(0, state)
            state = state.parent
        return result


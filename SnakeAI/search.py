from arena import Arena
from astar import Astar
from greedybfs import GBFS
from dijkstra import DSP
from utils import Utils
from state import State
import json
# arena = Arena(
#    [
#        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
#    ], (8,12), (2,6))
# start = State(arena.start, None, "right", None, 0)

arena_str = input()
arena_obj = json.loads(arena_str)
arena = Arena(arena_obj["world"],(arena_obj["snake"]["x"],arena_obj["snake"]["y"]),(arena_obj["food"]["x"],arena_obj["food"]["y"]))
start = State(arena.start, None, arena_obj["direction"], None, 0)
end = State(arena.food, None, None, None, None)
if(arena_obj["method"] == "dijkstra"):
    solution = DSP.search(arena, start, end)
elif (arena_obj["method"] == "greedy"):
    solution = GBFS.search(arena, start, end)
else:
    solution = Astar.search(arena, start, end)
result = {}
if solution == None:
    result["status"] = "failure"
    result["message"] = "The snake cannot reach its food"
else:
    result["status"] = "success"
    path = Utils.get_path(solution)
    path_str = ""
    for step in path:
        path_str += step.print(recursive=False)+","
	
    path_str = "["+path_str[:-1]+"]"
    result["solution"] = json.loads(path_str)
print(json.dumps(result))
	

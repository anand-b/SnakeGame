from utils import Utils
import heapq

class DSP:
    def search(arena, start, end):
        graph = arena.world
        frontier = list()
        visited = dict()
        heapq.heappush(frontier, (0, start))
        last = None
        while len(frontier) != 0:
            cost, current = heapq.heappop(frontier)
            if current.equals(end):
                last = current
                break
            neighbors = Utils.remove_unsafe(arena, Utils.get_neighbours(arena, current))
            for next in neighbors:
                if next.position not in visited or next.cost < visited[next.position]:
                    visited[next.position] = next.cost
                    priority = next.cost
                    heapq.heappush(frontier, (priority, next))

        return last
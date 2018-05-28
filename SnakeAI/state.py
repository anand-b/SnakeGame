import json

class State:
    def __init__(self, _position, _parent, _direction, _action, _cost):
        self.position = _position
        self.parent = _parent
        self.direction = _direction
        self.action = _action
        self.cost = _cost

    def equals(self, obj):
        return (self.position == obj.position)

    def __lt__(self, other):
        return self.cost < other.cost

    def print(self, recursive=True):
        if self.parent != None and recursive == True:
            parent_str = self.parent.print()
        else:
            parent_str = None

        if(self.action != None):
            action_str = self.action
        else:
            action_str = None
        return json.dumps({"position":{"x" : self.position[0],"y" : self.position[1]},"parent"  : parent_str,"direction" : self.direction,"action" : action_str,"cost" : self.cost})
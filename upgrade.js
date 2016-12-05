module.exports.run = function(creep, needCreeps)
{
    if (!creep.memory.working)
    {
        if (creep.memory.target)
        {
            let result = creep.withdraw(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(Game.getObjectById(creep.memory.target));
            }
            else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_NOT_ENOUGH_RESOURCES)
            {
                creep.memory.target = 0;
            }
            return;
        }

        let containers = creep.room.find(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && (o.store[RESOURCE_ENERGY] > 0) && (o.isActive() == true)});

        for (let container of containers)
        {
            if (creep.pos.getRangeTo(container) < 8)
            {
                creep.memory.target = container.id;
                let result = creep.withdraw(container, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(container);
                }
                else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.memory.target = 0;
                }
                return;
            }
        }

        //we are not full
        if (needCreeps == false)
        {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => ((o.structureType == STRUCTURE_CONTAINER) && (o.store[RESOURCE_ENERGY] > 0) && (o.isActive() == true)) ||
                                                                                    (o.structureType == STRUCTURE_EXTENSION || o.structureType == STRUCTURE_SPAWN) && (o.energy > 1)});
            if (target)
            {
                creep.memory.target = target.id;
                let result = creep.withdraw(target, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_NOT_ENOUGH_RESOURCES)
                {
                    creep.memory.target = 0;
                }
                return;
            }
        }
        else
        {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source);
            }
        }
    }
    else
    {
        //we are full
        if(creep.room.controller)
        {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};
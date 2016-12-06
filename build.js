module.exports.run = function(creep, needCreeps)
{
    if (!creep.memory.working)
    {
        //we are not full
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
        let containers = creep.room.find(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER)});
        if (containers.length > 0)
        {
            let container = creep.pos.findClosestByPath(containers);
            if (container.store[RESOURCE_ENERGY] > 250)
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
        if (needCreeps == false)
        {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION || o.structureType == STRUCTURE_SPAWN) && o.energy > 5});
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
    }
    else
    {
        if (creep.memory.target)
        {
            let result = creep.build(Game.getObjectById(creep.memory.target));
            if (result == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(Game.getObjectById(creep.memory.target));
            }
            else if (result == OK || result == ERR_INVALID_TARGET)
            {
                creep.memory.target = 0;
            }
            return;
        }
        //we are full
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_TOWER});
        if (target)
        {
            creep.memory.target = target.id;
            let result = creep.build(target);
            if (result == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
            else if (result == OK || result == ERR_INVALID_TARGET)
            {
                creep.memory.target = 0;
            }
            return;
        }
        else
        {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_EXTENSION});
            if (target)
            {
                creep.memory.target = target.id;
                let result = creep.build(target);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                else if (result == OK || result == ERR_INVALID_TARGET)
                {
                    creep.memory.target = 0;
                }
                return;
            }
            else
            {
                let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_ROAD});
                if (target)
                {
                    creep.memory.target = target.id;
                    let result = creep.build(target);
                    if (result == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                    else if (result == OK || result == ERR_INVALID_TARGET)
                    {
                        creep.memory.target = 0;
                    }
                    return;
                }
                else
                {
                    let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_CONTAINER ||
                                                                                                    o.structureType == STRUCTURE_STORAGE || o.structureType == STRUCTURE_RAMPART ||
                                                                                                    o.structureType == STRUCTURE_WALL});
                    if (target)
                    {
                        creep.memory.target = target.id;
                        let result = creep.build(target);
                        if (result == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                        else if (result == OK || result == ERR_INVALID_TARGET)
                        {
                            creep.memory.target = 0;
                        }
                        return;
                    }
                    else
                    {
                        //nothing to build, lets repair
                        let targets = creep.room.find(FIND_STRUCTURES, {filter: (o) => o.structureType != STRUCTURE_WALL && (o.hits < o.hitsMax)});

                        targets.sort((a,b) => a.hits - b.hits); //this sorts the array in ascending numbers by hits

                        if (targets.length)
                        {
                            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(targets[0]);
                            }
                        }
                    }
                }
            }
        }
    }
};
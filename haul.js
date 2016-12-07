module.exports.run = function(creep)
{
    //move energy from top container to spawn / extensions / tower
    //if those are full already, move it to bottom container

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
        //we are not full

        let targets = creep.room.find(FIND_DROPPED_ENERGY);

        if (targets.length > 0)
        {
            //there is some dropped energy
            for (let target of targets)
            {
                //console.log("Found dropped energy of amount: " + target.amount);
                if (target.amount > 10)
                {
                    //console.log(target.amount);
                    let result = creep.pickup(target);
                    if (result == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                    return;
                }
            }
        }
        //get containers which within 2 squares to source

        let containers = creep.room.find(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && (o.pos.findInRange(FIND_SOURCES, 2).length != 0) &&
                                                                            (o.pos.findInRange(o.room.controller, 2).length == 0) &&
                                                                            (o.store[RESOURCE_ENERGY] > 100) && (o.isActive() == true)});
        if (containers.length > 0)
        {
            for (let container of containers)
            {
                if (container.store[RESOURCE_ENERGY] > (container.storeCapacity - 100))
                {
                    creep.memory.target = container.id;
                }
            }

            if (!creep.memory.target)
            {
                creep.memory.target = creep.pos.findClosestByPath(containers).id;
            }
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
    }
    else
    {
        //we are full
        if (creep.memory.target)
        {
            //console.log("we have target - " + Game.getObjectById(creep.memory.target));
            let result = creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(Game.getObjectById(creep.memory.target));
            }
            else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_FULL)
            {
                creep.memory.target = 0;
            }
            return;
        }
        if (creep.pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0)
        {
            //console.log("no road here");
            creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION && (o.energy < o.energyCapacity)) ||
                                                                                    (o.structureType == STRUCTURE_SPAWN && (o.energy < o.energyCapacity)) ||
                                                                                    (o.structureType == STRUCTURE_TOWER && (o.energy < 200))});
        if (target)
        {
            creep.memory.target = target.id;
            let result = creep.transfer(target, RESOURCE_ENERGY);
            if (result == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
            else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_FULL)
            {
                creep.memory.target = 0;
            }
            return;
        }
        else
        {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_TOWER) && (o.energy < 700)});
            if (target)
            {
                creep.memory.target = target.id;
                let result = creep.transfer(target, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_FULL)
                {
                    creep.memory.target = 0;
                }
                return;
            }
            else
            {
                //get containers which not within 2 squares to source
                let containers = creep.room.find(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) &&
                                                                                ((o.pos.findInRange(FIND_SOURCES, 2).length == 0) || (o.pos.findInRange(o.room.controller, 2).length != 0))});
                console.log(containers);
                containers.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
                creep.memory.target = containers[0].id;
                let result = creep.transfer(containers[0], RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(containers[0]);
                }
                else if (result == OK || result == ERR_INVALID_TARGET || result == ERR_FULL)
                {
                    creep.memory.target = 0;
                }
                return;
            }
        }
    }
};
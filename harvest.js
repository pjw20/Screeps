module.exports.run = function(creep)
{
    if (!creep.memory.working)
    {
        if (creep.memory.targetRoom == undefined)
        {
            creep.memory.targetRoom = creep.room;
        }

        if (creep.room == creep.memory.targetRoom)
        {
            //we are not full
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
        let target = 0;
        if (creep.room.memory.numHaulers != 0)
        {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && (o.store[RESOURCE_ENERGY] < o.storeCapacity) && o.isActive() == true});
            if (creep.pos.getRangeTo(target) > 15)
            {
                //too far away
                target = 0;
            }
        }

        if (!target)
        {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION) && (o.energy < o.energyCapacity) ||
                                                                                    (o.structureType == STRUCTURE_SPAWN) && (o.energy < o.energyCapacity)});
        }

        if (target)
        {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            if(creep.room.controller)
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};
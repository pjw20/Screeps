module.exports.run = function(creep, needCreeps)
{
    if (!creep.memory.working)
    {
        //we are not full
        if (creep.room.energyAvailable >= 100 && needCreeps == false)
        {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && o.store[RESOURCE_ENERGY] > 0});
            if (target)
            {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            else
            {
                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION || o.structureType == STRUCTURE_SPAWN) && o.energy > 0});
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
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
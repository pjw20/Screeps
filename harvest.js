module.exports.run = function(creep)
{
    if (!creep.memory.working)
    {
        //we are not full
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(source);
        }
    }
    else
    {
        //we are full
        if (creep.room.memory.numHaulers != 0)
        {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && (o.store[RESOURCE_ENERGY] < o.storeCapacity)});
        }
        else
        {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION) && (o.energy < o.energyCapacity) ||
            (o.structureType == STRUCTURE_SPAWN) && (o.energy < o.energyCapacity)});
        }

        //console.log(target);
        //TODO: what to do if all structures are full
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target);
        }
    }
};
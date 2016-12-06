module.exports.run = function(creep)
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
};
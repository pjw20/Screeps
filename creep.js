module.exports.run = function(creep)
{
    if (creep.carry.energy == creep.carryCapacity)
    {
        creep.memory.working = true;
    }
    else if (creep.carry.energy == 0)
    {
        creep.memory.working = false;
    }
};
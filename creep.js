module.exports.run = function(creep)
{
    if (creep.memory.role == "hauler")
    {
        if (creep.room.find(FIND_STRUCTURES, {filter: (o) => o.structureType == STRUCTURE_CONTAINER}).length == 0)
        {
            creep.memory.role = "harvester";
        }
    }

    if (creep.carry.energy == creep.carryCapacity)
    {
        switch (creep.memory.role)
        {
            case "harvester":
                creep.say("dr");
                break;
            case "builder":
                creep.say("bu");
                break;
            case "upgrader":
                creep.say("up");
                break;
            case "hauler":
                creep.say("ha");
                break;
            default:
                break;
        }
        creep.memory.working = true;
    }
    else if (creep.carry.energy == 0)
    {
        switch (creep.memory.role)
        {
            case "harvester":
                creep.say("hv");
                break;
            case "builder":
                creep.say("co");
                break;
            case "upgrader":
                creep.say("co");
                break;
            case "hauler":
                creep.say("co");
                break;
            default:
                break;
        }
        creep.memory.working = false;
    }
};
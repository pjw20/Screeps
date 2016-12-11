module.exports.run = function(creep)
{
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
                creep.say("bco");
                break;
            case "upgrader":
                creep.say("uco");
                break;
            case "hauler":
                creep.say("hco");
                break;
            case "claimer":
                creep.say("cl");
                break;
            default:
                break;
        }
        creep.memory.working = false;
    }
};
//require stuff
let rSpawn = require("spawn");
let rCreep = require("creep");
let rHarvest = require("harvest");
let rUpgrade = require("upgrade");
let rBuild = require("build");
let rHaul = require("haul");


module.exports.loop = function ()
{
    var startCPU = Game.cpu.getUsed();
    let needCreeps = false;
    //delete old creep memory
    for(let name in Memory.creeps)
    {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    Memory.numRoomsOwned = 0;
    for (let name in Game.rooms) //gets name
    {
        let curRoom = Game.rooms[name]; //gets room object

        if (curRoom.controller != undefined && curRoom.controller.my)
        {
            //we own the room
            Memory.numRoomsOwned++;
            //find number of sources
            curRoom.memory.sources = curRoom.find(FIND_SOURCES);
            curRoom.memory.numHarvesters = _.sum(Game.creeps, (o) => o.memory.role =="harvester");
            curRoom.memory.numBuilders = _.sum(Game.creeps, (o) => o.memory.role =="builder");
            curRoom.memory.numUpgraders = _.sum(Game.creeps, (o) => o.memory.role =="upgrader");
            curRoom.memory.numHaulers = _.sum(Game.creeps, (o) => o.memory.role =="hauler");

            if (curRoom.memory.numHarvesters < (curRoom.memory.sources.length + 1))
            {
                //we need more harvesters in this room
                needCreeps = true;
                rSpawn.run(curRoom.energyCapacityAvailable, "harvester", curRoom);
            }
            else if (curRoom.memory.numUpgraders < (curRoom.memory.sources.length + 1))
            {
                needCreeps = true;
                rSpawn.run(curRoom.energyCapacityAvailable, "upgrader", curRoom);
            }
            else if (curRoom.memory.numHaulers < curRoom.memory.sources.length)
            {
                needCreeps = true;
                rSpawn.run(curRoom.energyCapacityAvailable, "hauler", curRoom);
            }
            else if (curRoom.memory.numBuilders < 2)
            {
                needCreeps = true;
                rSpawn.run(curRoom.energyCapacityAvailable, "builder", curRoom);
            }
        }
    }

    var endSpawnCPU = Game.cpu.getUsed();
    if ((endSpawnCPU - startCPU) > 5)
    {
        console.log("WARNING: SPAWN CPU SPIKE - " + (endSpawnCPU - startCPU) + " CPU");
    }
    for (let name in Game.creeps) //gets name
    {
        let creep = Game.creeps[name]; //gets object
        rCreep.run(creep);
        switch (creep.memory.role)
        {
            case "harvester":
                rHarvest.run(creep);
                break;
            case "builder":
                rBuild.run(creep, needCreeps);
                break;
            case "upgrader":
                rUpgrade.run(creep, needCreeps);
                break;
            case "hauler":
                rHaul.run(creep);
                break;
            default:
                break;
        }
    }
    var endCreepCPU = Game.cpu.getUsed();
    if ((endCreepCPU - endSpawnCPU) > 5)
    {
        console.log("WARNING: CREEP CPU SPIKE - " + (endCreepCPU - endSpawnCPU) + " CPU");
    }
};
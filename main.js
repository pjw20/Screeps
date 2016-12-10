//require stuff
let rSpawn = require("spawn");
let rCreep = require("creep");
let rHarvest = require("harvest");
let rUpgrade = require("upgrade");
let rBuild = require("build");
let rHaul = require("haul");
let rRepair = require("repair");
let rTower = require("tower");


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

            rTower.run(curRoom);
            curRoom.memory.numCreeps = 0;

            for (let name in Game.creeps)
            {
                if (Game.creeps[name].room == curRoom)
                {
                    curRoom.memory.numCreeps++;
                }
            }

            //find number of sources
            curRoom.memory.sources = curRoom.find(FIND_SOURCES);
            curRoom.memory.numHarvesters = _.sum(Game.creeps, (o) => o.memory.role =="harvester");
            curRoom.memory.numBuilders = _.sum(Game.creeps, (o) => o.memory.role =="builder");
            curRoom.memory.numUpgraders = _.sum(Game.creeps, (o) => o.memory.role =="upgrader");
            curRoom.memory.numHaulers = _.sum(Game.creeps, (o) => o.memory.role =="hauler");

            let switchRoles = false;
            if (curRoom.memory.numCreeps < 7)
            {
                if (curRoom.memory.numHarvesters < 2)
                {
                    for (let name in Game.creeps)
                    {
                        let creep = Game.creeps[name];
                        if (creep.memory.role == "builder" && creep.room == curRoom)
                        {
                            creep.memory.role = "harvester";
                            switchRoles = true;
                            break;
                        }
                    }
                    if (!switchRoles)
                    {
                        needCreeps = true;
                        rSpawn.run(curRoom.energyCapacityAvailable, "harvester", curRoom);
                    }
                }
                else if (curRoom.memory.numUpgraders < 2)
                {
                    if (!switchRoles)
                    {
                        needCreeps = true;
                        rSpawn.run(curRoom.energyCapacityAvailable, "upgrader", curRoom);
                    }
                }
                else if (curRoom.memory.numHaulers < 2 && curRoom.find(FIND_STRUCTURES, {filter: (o) => o.structureType == STRUCTURE_CONTAINER}).length > 0)
                {
                    if (!switchRoles)
                    {
                        needCreeps = true;
                        rSpawn.run(curRoom.energyCapacityAvailable, "hauler", curRoom);
                    }
                }
                else if (curRoom.memory.numBuilders < 1)
                {
                    needCreeps = true;
                    rSpawn.run(curRoom.energyCapacityAvailable, "builder", curRoom);
                }
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
        var curCreepCPUStart = Game.cpu.getUsed();
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
            case "repairer":
                rRepair.run(creep);
                break;
            default:
                break;
        }
        var curCreepCPUEnd = Game.cpu.getUsed();
        if ((curCreepCPUEnd-curCreepCPUStart) > 8)
        {
            console.log("WARNING: CURRENT CREEP (" + name + " - " + creep.memory.role + ") CPU SPIKE - " + (curCreepCPUEnd-curCreepCPUStart) + " CPU")
        }
    }
    var endCreepCPU = Game.cpu.getUsed();
    if ((endCreepCPU - endSpawnCPU) > 10)
    {
        console.log("WARNING: CREEP CPU SPIKE - " + (endCreepCPU - endSpawnCPU) + " CPU");
    }
};
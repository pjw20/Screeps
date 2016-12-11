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

            curRoom.memory.needCreeps = false;

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
            //curRoom.memory.sources = curRoom.find(FIND_SOURCES);


            curRoom.memory.numHarvesters = _.sum(Game.creeps, (o) => o.memory.role =="harvester" && o.memory.homeRoom == curRoom.name);
            curRoom.memory.numBuilders = _.sum(Game.creeps, (o) => o.memory.role =="builder" && o.memory.homeRoom == curRoom.name);
            curRoom.memory.numUpgraders = _.sum(Game.creeps, (o) => o.memory.role =="upgrader" && o.memory.homeRoom == curRoom.name);
            curRoom.memory.numHaulers = _.sum(Game.creeps, (o) => o.memory.role =="hauler" && o.memory.homeRoom == curRoom.name);
            curRoom.memory.numLongHarvesters = _.sum(Game.creeps, (o) => o.memory.role =="longharvester" && o.memory.homeRoom == curRoom.name);

            let switchRoles = false;
            if (curRoom.memory.numCreeps < 7)
            {
                if (curRoom.memory.numHarvesters < 2)
                {
                    if (!switchRoles)
                    {
                        curRoom.memory.needCreeps = true;
                        rSpawn.run(curRoom.energyCapacityAvailable, "harvester", curRoom);
                    }
                }
                else if (curRoom.memory.numUpgraders < 2)
                {
                    if (!switchRoles)
                    {
                        curRoom.memory.needCreeps = true;
                        rSpawn.run(curRoom.energyCapacityAvailable, "upgrader", curRoom);
                    }
                }
                else if (curRoom.memory.numHaulers < 1 && curRoom.find(FIND_STRUCTURES, {filter: (o) => o.structureType == STRUCTURE_CONTAINER}).length > 0)
                {
                    if (!switchRoles)
                    {
                        curRoom.memory.needCreeps = true;
                        rSpawn.run(curRoom.energyCapacityAvailable, "hauler", curRoom);
                    }
                }
                else if (curRoom.memory.numBuilders < 1)
                {
                    curRoom.memory.needCreeps = true;
                    rSpawn.run(curRoom.energyCapacityAvailable, "builder", curRoom);
                }
                else if (curRoom.memory.numLongHarvesters < 1 && curRoom.name == "E79S56")
                {
                    curRoom.memory.needCreeps = true;
                    rSpawn.run(curRoom.energyCapacityAvailable, "longharvester", curRoom);
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
            case "longharvester":
                rHarvest.run(creep);
                break;
            case "builder":
                rBuild.run(creep);
                break;
            case "upgrader":
                rUpgrade.run(creep);
                break;
            case "hauler":
                rHaul.run(creep);
                break;
            case "repairer":
                rRepair.run(creep);
                break;
            case "claimer":
                if (creep.room.name == creep.memory.targetRoom)
                {
                    if(creep.room.controller)
                    {
                        if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
                else
                {
                    creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom));
                }
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
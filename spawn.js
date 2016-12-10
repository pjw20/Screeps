module.exports.run = function(energy, creepRole, curRoom)
{
    let targetRoom = curRoom.name;
    if (curRoom.memory.numHarvesters == 0)
    {
        energy = curRoom.energyAvailable;
    }
    if (energy < 200)
    {
        console.log("We can't make a creep with so little energy, wait a bit");
        return;
    }

    if (energy > 1400)
    {
        energy = 1400;
    }

    if (curRoom.energyAvailable < energy)
    {
        return;
    }

    let newCreep = [];

    if (creepRole == "harvester" || creepRole == "builder")
    {
        while (energy >= 50)
        {
            if (energy >= 100)
            {
                newCreep.push(WORK);
                energy -= 100;
            }
            if (energy >= 50)
            {
                newCreep.push(CARRY);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
        }
    }

    if (creepRole == "longharvester")
    {
        targetRoom = "E78S56"; //hardcoded for now
        while (energy >= 50)
        {
            if (energy >= 100)
            {
                newCreep.push(WORK);
                energy -= 100;
            }
            if (energy >= 50)
            {
                newCreep.push(CARRY);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(CARRY);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
            if (energy >= 80)
            {
                newCreep.push(ATTACK);
                energy -= 80;
            }
        }
    }

    if (creepRole == "upgrader")
    {
        while (energy >= 50)
        {
            if (energy >= 100)
            {
                newCreep.push(WORK);
                energy -= 100;
            }
            if (energy >= 100)
            {
                newCreep.push(WORK);
                energy -= 100;
            }
            if (energy >= 50)
            {
                newCreep.push(CARRY);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
        }
    }

    if (creepRole == "hauler")
    {
        while (energy >= 50)
        {
            if (energy >= 50)
            {
                newCreep.push(CARRY);
                energy -= 50;
            }
            if (energy >= 50)
            {
                newCreep.push(MOVE);
                energy -= 50;
            }
        }
    }

    let spawns = curRoom.find(FIND_MY_SPAWNS);
    spawns[0].createCreep(newCreep, {role: creepRole, working: false, homeRoom: curRoom.name, targetRoom: targetRoom});
};
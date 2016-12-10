module.exports.run = function(creep)
{
    if (!creep.memory.working)
    {
        if (creep.memory.targetRoom == undefined)
        {
            creep.memory.targetRoom = creep.room.name;
        }

        if (creep.room.name == creep.memory.targetRoom)
        {
            //we are not full
            if (creep.room.name != creep.memory.homeRoom)
            {
                //we arent at home
                let enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                if (enemyCreeps.length > 0)
                {
                    //there's an enemy in here with us
                    if (creep.pos.getRangeTo(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)) < 2)
                    {
                        //it's right next to us!
                    }
                }
            }
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source);
            }
        }
        else
        {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom));
        }
    }
    else
    {
        if (creep.memory.homeRoom == undefined)
        {
            creep.memory.homeRoom = creep.room.name;
        }

        if (creep.room.name == creep.memory.homeRoom)
        {
            //we are full
            let target = 0;
            if (creep.room.memory.numHaulers != 0)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && (o.store[RESOURCE_ENERGY] < o.storeCapacity) && o.isActive() == true});
                if (creep.pos.getRangeTo(target) > 15)
                {
                    //too far away
                    target = 0;
                }
            }

            if (!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION) && (o.energy < o.energyCapacity) ||
                (o.structureType == STRUCTURE_SPAWN) && (o.energy < o.energyCapacity)});
            }

            if (target)
            {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            else
            {
                if(creep.room.controller)
                {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
        else
        {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.homeRoom));
        }
    }
};
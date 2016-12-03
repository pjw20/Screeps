module.exports.run = function(creep, needCreeps)
{
    if (!creep.memory.working)
    {
        //we are not full
        let containers = creep.room.find(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_CONTAINER) && (o.pos.findInRange(FIND_SOURCES_ACTIVE, 2).length != 0)});
        if (containers.length > 0)
        {
            let container = creep.pos.findClosestByPath(containers);
            if (container.store[RESOURCE_ENERGY] > creep.carryCapacity)
            {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(container);
                }
                return;
            }
            /*
            containers.sort((a,b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
            if (containers && (containers[0].store[RESOURCE_ENERGY] > (creep.carryCapacity*2)))
            {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(containers[0]);
                }
                return;
            }*/
        }
        if (needCreeps == false)
        {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => (o.structureType == STRUCTURE_EXTENSION || o.structureType == STRUCTURE_SPAWN) && o.energy > 0});
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source);
            }
        }
    }
    else
    {
        //we are full
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_TOWER});
        if (target)
        {
            if (creep.build(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }
        else
        {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_EXTENSION});
            if (target)
            {
                if (creep.build(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            else
            {
                let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_ROAD});
                if (target)
                {
                    if (creep.build(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (o) => o.structureType == STRUCTURE_CONTAINER ||
                                                                                                    o.structureType == STRUCTURE_STORAGE || o.structureType == STRUCTURE_RAMPART ||
                                                                                                    o.structureType == STRUCTURE_WALL});
                    if (target)
                    {
                        if (creep.build(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else
                    {
                        //nothing to build, lets repair
                        let targets = creep.room.find(FIND_STRUCTURES, {filter: (o) => o.hits < o.hitsMax});

                        targets.sort((a,b) => a.hits - b.hits); //this sorts the array in ascending numbers by hits

                        if (targets.length)
                        {
                            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(targets[0]);
                            }
                        }
                    }
                }
            }
        }
    }
};
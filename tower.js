module.exports.run = function(curRoom)
{
    let towers = curRoom.find(FIND_STRUCTURES, {filter: (o) => o.structureType == STRUCTURE_TOWER});

    let enemyCreeps = curRoom.find(FIND_HOSTILE_CREEPS);

    if (enemyCreeps.length > 0)
    {
        console.log("ENEMY FOUND");
        for (let tower of towers)
        {
            tower.attack(tower.pos.findClosestByRange(enemyCreeps));
        }
    }
    else
    {
        let targets = curRoom.find(FIND_MY_CREEPS, {filter: (o) => o.hits < o.hitsMax});
        targets.sort((a,b) => a.hits - b.hits); //this sorts the array in ascending numbers by hits

        if (targets.length)
        {
            for (let tower of towers)
            {
                tower.heal(targets[0]);
            }
        }
        else
        {
            let targets = curRoom.find(FIND_STRUCTURES, {filter: (o) => o.hits < o.hitsMax});
            targets.sort((a,b) => a.hits - b.hits); //this sorts the array in ascending numbers by hits

            if (targets.length)
            {
                if (targets[0].hits < 50000)
                {
                    for (let tower of towers)
                    {
                        tower.repair(targets[0]);
                    }
                }
            }
        }
    }
};
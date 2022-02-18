const dateNow = () =>{
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;
    return dateTime;
};

const rolld6 = () =>{
    return Math.floor(Math.random() * 6) + 1;
};

const ratioUser = (games) =>{
    const turnoutsUser = [];
    games.forEach((game)=>{
        const sum = game.die1+game.die2;
        if (sum === 7){
            turnoutsUser.push(1);
        } else {
            turnoutsUser.push(0);
        }
    });
    const ratio = 100 * turnoutsUser.reduce((a,b) => a+b, 0)/turnoutsUser.length;
    console.log(ratio);
    return ratio;
};

module.exports = {
    dateNow,
    rolld6,
    ratioUser
};
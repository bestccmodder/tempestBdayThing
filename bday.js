let modStylesheet = document.createElement("link");
modStylesheet.setAttribute("href", "modStyle.css");
modStylesheet.type = 'text/css';
modStylesheet.rel = 'stylesheet';
document.head.appendChild(modStylesheet);

let fireworks = document.createElement('div');
fireworks.id = 'fireworks';
fireworks.className = 'fireworks';
document.getElementById('game').insertBefore(fireworks, sparkles);

var img = 'img/cake.png';

var PlaySound = function (url, vol, pitchVar) {
    let volume = 1;
    let volumeSetting = Game.volume;
    if (typeof vol !== 'undefined') volume = vol;
    if (volume < -5) { volume += 10; volumeSetting = Game.volumeMusic; }
    if (!volumeSetting || volume == 0) return 0;
    if (typeof Sounds[url] === 'undefined') {
        //sound isn't loaded, cache it
        Sounds[url] = new Audio(url.indexOf('snd/') == 0 ? (Game.resPath + url) : url);
        Sounds[url].onloadeddata = function (e) { PlaySound(url, vol, pitchVar); }
        //Sounds[url].load();
    }
    else if (Sounds[url].readyState >= 2) {
        let sound = null;
        for (let i = 0; i < SoundInsts.length; i++) {
            if (SoundInsts[i].paused) {
                sound = SoundInsts[i];
                break;
            }
        }
        if (!sound) sound = new Audio();
        //var sound = SoundInsts[SoundI];
        //SoundI++;
        //if (SoundI >= 12) SoundI = 0;
        sound.src = Sounds[url].src;
        sound.currentTime = 0;
        sound.volume = Math.pow(volume * volumeSetting / 100, 2);
        if (pitchSupport) {
            var pitchVar = (typeof pitchVar === 'undefined') ? 0.05 : pitchVar;
            var rate = 1 + (Math.random() * 2 - 1) * pitchVar;
            sound.preservesPitch = false;
            sound.mozPreservesPitch = false;
            sound.webkitPreservesPitch = false;
            sound.playbackRate = rate;
        }

        if (typeof onEnded == 'function') {
            sound.onended = onEnded;
        }

        try { sound.play(); } catch (e) { }
    }
}


Game.fireworks = l('fireworks');
Game.fireworksT = 0;
Game.fireworksFrames = 16;
Game.shootAt = function (x, y) {
    if (Game.blendModesOn) {
        Game.fireworksT = Game.fireworksFrames + 1;
        Game.fireworks.style.backgroundPosition = '0px 0px';
        Game.fireworks.style.left = Math.floor(x - 64) + 'px';
        Game.fireworks.style.top = Math.floor(y - 64) + 'px';
        Game.fireworks.style.display = 'block';
    }
}
Game.fireworkColors = ['img/redSparkles.jpg', 'img/yellowSparkles.jpg', 'img/blueSparkles.jpg'];

Game.plsWork = function () {
    if (Game.fireworksT > 0) {
        Game.fireworks.style.backgroundPosition = -Math.floor((Game.fireworksFrames - Game.fireworksT + 1) * 256) + 'px 0px';
        Game.fireworksT--;
        if (Game.fireworksT == 1) Game.fireworks.style.display = 'none';
    }
}
Game.registerHook('logic', Game.plsWork);

Game.Loader.Replace('perfectCookie.png', 'idk.png');

var css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = '.product .icon,.product .icon.off,.tinyProductIcon{background-image:url("img/gus.png");}';
document.head.appendChild(css);

for (let i in Game.Objects) {
    Game.Objects[i].icon = 0;
    Game.Objects[i].displayName = 'Gus';
}
Game.Objects['Grandma'].iconFunc = function (type) {
    var grandmaIcons = [[0, 0]];
    if (type == 'off') return [0, 0];
    return grandmaIcons[0, 0];
};

Game.RefreshStore();

setInterval(function () {
    let list = [];
    for (let i in Game.fireworkColors) {
        list.push(Game.fireworkColors[i]);
    }
    let choosenColor = choose(list);
    l('fireworks').style.backgroundImage = 'url(' + choosenColor + ')';

    posX = Math.floor(Math.random() * Math.max(0, (Game.bounds.right - 300) - Game.bounds.left - 128) + Game.bounds.left + 64) - 64;
    posY = Math.floor(Math.random() * Math.max(0, Game.bounds.bottom - Game.bounds.top - 128) + Game.bounds.top + 64) - 64;
    Game.shootAt(posX + 48, posY + 48);
}, 400);

new Game.Upgrade('Birthday cake', 'Not as good as a real one but will do the job. I hope you like this gift! <q>This cake ISN\'T a lie</q>', 0, [0, 0, img]);
Game.Unlock('Birthday cake');

LocalizeUpgradesAndAchievs();

var audio = new Audio('');
audio.volume = Math.pow(1 * 75 / 100, 2);
audio.onended = function () {
    for (let i = 0; i < 100; i++) {
        new Game.shimmer('golden', { noWrath: true });
    }
};
audio.play();

Game.Popup('Happy Birthday Tempest!!', (Game.bounds.left + Game.bounds.right) / 2, (Game.bounds.top + Game.bounds.bottom) / 2 + 240);


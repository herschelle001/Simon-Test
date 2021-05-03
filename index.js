var generated_pattern = [];
var user_response = [];
var color = ["green_poop", "red_poop", "yellow_poop", "blue_poop"];
var start = false;
let flash = 0;
var take_input = false;
var id = null;
var localStorageName = "crackalien";
var scale = 1;
var audios = [new Audio(), new Audio(), new Audio(), new Audio(), new Audio()];
var backup_audios = [new Audio(), new Audio(), new Audio(), new Audio(), new Audio()];

setInterval(function () {
    scale = scale === 1 ? 1.1 : 1
    $('#start_button').css('transform', 'scale(' + scale + ')');
}, 1000)

$("#start_button").click(startGame);

$("#play_again").click(function () {
    $("#game-div").removeClass("hide");
    $("#game-over-div").addClass("hide");
    startGame();
});

$(".blocks").click(pattern_checker);

function pattern_checker() {
    let audio;
    if (take_input && start) {
        user_response.push($(this).attr("id"));
        if (generated_pattern[user_response.length - 1] === $(this).attr("id")) {
            p = this;
            var i = $(this).attr("id");
            $(this).addClass("pressed_" + i);
            let audio = audios[color.indexOf($(this).attr("id"))];
            if(generated_pattern.length > 1) {
                if(user_response[user_response.length-1] === user_response[user_response.length-2]) {
                    audio = backup_audios[color.indexOf($(this).attr("id"))];
                }
            }
            setTimeout(function () {
                $(p).removeClass("pressed_" + i);
            }, 300);
            audio.play();
            if (generated_pattern.length === user_response.length) {
                setTimeout(function () {
                    take_input = false;
                    level();
                }, 100);
                user_response = [];
            }
        } else {
            $("#score_text").html(giveScore());
            take_input = false;
            flash = 0;
            start = false;
            generated_pattern = [];
            user_response = [];
            $("body").addClass("game-over");
            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 100);
            i = $(this).attr("id");
            var p = this;
            $(this).addClass("pressed_" + i);
            setTimeout(function () {
                $(p).removeClass("pressed_" + i);
                $("#game-div").addClass("hide");
                $("#game-over-div").removeClass("hide");
            }, 100);
            audio = audios[4];
            audio.play();
        }
    }
}

function startGame() {
    for (let loop = 0; loop < audios.length; loop++) {
        var i = audios[loop];
        var j = backup_audios[loop];
        i.play();
        j.play();
        i.pause();
        j.pause();
        if (loop !== 4) {
            i.src = 'Sound/' + color[loop] + '.wav';
            j.src = 'Sound/' + color[loop] + '.wav';
        } else {
            i.src = 'Sound/wrong.wav';
        }
    }
    start = true;
    generated_pattern = [];
    user_response = [];
    take_input = false;
    document.getElementById("start_button").style.display = "none";
    $("#level_button").removeClass("hide");
    level();
}

function level() {
    flash = 0;
    var level_number = (generated_pattern.length + 1);
    level_number = level_number.toString();
    $("#level_button").text("Level : " + level_number);
    sound();
}

function sound() {
    var prev = -1;
    if (generated_pattern.length > 1) {
        prev = generated_pattern[generated_pattern.length - 2];
    }
    var x = Math.random();
    x = Math.floor(x * 4);
    if (prev === color[x]) {
        if (x === 3) {
            x = 0;
        } else {
            x = x + 1;
        }
    }
    generated_pattern.push(color[x]);
    interval = setInterval(lightOn, 1500);
}

function lightOn() {
    if (flash < generated_pattern.length) {
        if (generated_pattern.length === 1) {
            audio = audios[color.indexOf(generated_pattern[flash])];
            setTimeout(() => {
                audio.play();
                $("#" + generated_pattern[flash]).fadeOut(150).fadeIn(150);
                flash++;
            }, 1000);
        } else {
            audio = audios[color.indexOf(generated_pattern[flash])];
            setTimeout(() => {
                audio.play();
                $("#" + generated_pattern[flash]).fadeOut(150).fadeIn(150);
                flash++;
            }, 300);
        }

    } else if (flash === generated_pattern.length) {
        clearInterval(interval)
        take_input = true;
    }
}

function giveScore() {
    const score = (generated_pattern.length - 1).toString();
    var highScore = localStorage.getItem(localStorageName) == null ? 0 :
        localStorage.getItem(localStorageName);
    highScore = Math.max((generated_pattern.length) - 1, highScore);
    localStorage.setItem(localStorageName, String(highScore));
    highScore = String(highScore);
    var text = score;
    if (score.length + highScore.length < 29) {
        for (var j = 0; j < 29 - score.length - highScore.length; j++) {
            text = text + "\xa0";
        }
    } else
        text = text + "\xa0";
    text = text + highScore;
    return text;
}
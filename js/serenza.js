// Initial state of the application
var playing = false;
var currentWord = -1;
var wordList = null;
var interval = null;
var timeout = null;

// The word lists
const words = { };

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function applyState() {

    console.log("Applying state, playing:", playing);

    if (playing) {

        // Disabling play button and enabling stop
        $("#play").attr("disabled", "true");
        $("#stop").removeAttr("disabled");

        // Parse the settings
        const settings = parseSettings();
        console.log("Settings", settings);

        // Prepare the word list
        wordList = prepareWordList(words[settings.lang], settings.len);
        currentWord = -1;
        console.log("Word list", wordList);

        // Show the next word
        setNextWord();

        // Set the timer to update the word
        if (interval)
            clearInterval(interval);
        interval = setInterval(setNextWord, settings.time * 2 * 1000);

        // Set the duration of the exercise
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(stop, settings.duration * 5 * 60000);

        // Hiding settings and showing the words
        $("#settings").hide();
        $("#words").show();

    } else {

        // Disabling stop button and enabling play
        $("#stop").attr("disabled", "true");
        $("#play").removeAttr("disabled");

        // Disable the timers and clear the word list
        if (interval)
            clearInterval(interval);
        if (timeout)
            clearTimeout(timeout);
        interval = null;
        timeout = null;
        wordList = null;
        currentWord = -1;

        // Hiding words and showing the settings
        $("#words").hide();
        $("#settings").show();

    }
}

function play() {
    console.log("Switching to playing state");
    if (playing) {
        console.warn("Already in playing state");
    } else {
        playing = true;
        applyState();
    }
}

function stop() {
    console.log("Switching to stopped state");
    if (!playing) {
        console.warn("Already in stopped state");
    } else {
        playing = false;
        applyState();
    }
}

function loadWordList(lang, file) {
    console.log("Loading", lang, "from", file);
    $.ajax({
        url: file,
        dataType: "json",
        mimeType: "application/json",
        success: function(list) {
            console.log("Loaded", lang, "with", list.length, "words");
            words[lang] = list;
        }
    });
}

function prepareWordList(list, len) {
    let filter;
    switch (len) {
        case 1:
            filter = w => w.length <= 5;
            break;
        case 2:
            filter = w => w.length == 6 || w.length == 7;
            break;
        case 3:
            filter = w => w.length == 8 || w.length == 9;
            break;
        case 4:
            filter = w => w.length >= 10;
            break;
    }
    const filtered = list.filter(filter);
    shuffle(filtered);
    return filtered;
}

function setNextWord() {
    currentWord = (currentWord + 1) % wordList.length;
    console.log("Next word:", wordList[currentWord]);
    $("#word").text(wordList[currentWord]);
}

function parseSettings() {
    const lang = $("#settings input[name=lang]:checked").val();
    const len = parseInt($("#settings input[name=len]:checked").val());
    const time = parseInt($("#settings input[name=time]:checked").val());
    const duration = parseInt($("#settings input[name=duration]:checked").val());
    return {
        lang: lang,
        len: len,
        time: time,
        duration: duration
    }
}

window.onload = function() {

    // Load the app resources, like the word lists
    loadWordList("it", "words/it.json");
    loadWordList("de", "words/de.json");
    loadWordList("fr", "words/fr.json");
    loadWordList("en", "words/en.json");

    // Setup event handlers
    $("#play").click(play);
    $("#stop").click(stop);

    // Apply the initial state
    applyState();

    // Load complete, show everything
    $("body").show();
}

// Saves options to localStorage.
    function save_options() {
        if (!window.localStorage) {
            alert("Error local storage is unavailable.");
            window.close();
        }

        window.localStorage.autoClipboard =
            document.getElementById("autoClipboard").checked ? true : false;

        window.localStorage.autoClipboardNoGrid =
            document.getElementById("autoClipboardNoGrid").checked ? true : false;

        window.localStorage.enableColorToolbox =
            document.getElementById("enableColorToolbox").checked ? true : false;

        window.localStorage.enableColorTooltip =
            document.getElementById("enableColorTooltip").checked ? true : false;

        window.localStorage.enableRightClickDeactivate =
            document.getElementById("enableRightClickDeactivate").checked ? true : false;

        cursor = document.getElementById('dropperCursorcrosshair').checked ? 'crosshair' : 'default';
        window.localStorage.dropperCursor =  cursor;

        window.localStorage.keyActivate = $("#keyActivate").html();

        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
            status.innerHTML = "";
        }, 750);
    }

// Restores select box state to saved value from localStorage.
function restore_options() {
    document.getElementById("autoClipboard").checked =
        (window.localStorage.autoClipboard === "true") ? true : false;
    document.getElementById("autoClipboardNoGrid").checked =
        (window.localStorage.autoClipboardNoGrid === "true") ? true : false;
    document.getElementById("enableColorToolbox").checked =
        (window.localStorage.enableColorToolbox === "false") ? false : true;
    document.getElementById("enableColorTooltip").checked =
        (window.localStorage.enableColorTooltip === "false") ? false : true;
    document.getElementById("enableRightClickDeactivate").checked =
        (window.localStorage.enableRightClickDeactivate === "false") ? false : true;

    cursor = (window.localStorage.dropperCursor === 'crosshair') ? 'crosshair' : 'default';
    document.getElementById('dropperCursor'+cursor).checked = true;

    key = window.localStorage.keyActivate;
    if ( key == undefined || key == "" )
        key = "none";

    $("#keyActivate").html( key );
}

function keysStartListening() {
    ////console.log('starting listener');
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keypress", function(e) { e.preventDefault(); return false; }, false);
}

function keysStopListening() {
    ////console.log('stoping listener');
    document.removeEventListener("keydown", keyDown, false);
}

function keyDown(e) {
    ////console.log('key down');
    var k = KeyCode;

    var hotkey = k.hot_key(k.translate_event(e));
    if ( hotkey == 'Escape' ) {
        $("#keycode-dialog").modal('hide');

    } else {
        $("#shortKeyActivate").html(hotkey);
        e.preventDefault();
    }
}

function changeShortcut(shortcutName, key) {
    console.log('changing shortcut');
    chrome.windows.getAll({'populate':true}, function(windows){
        windows.forEach(function(win) {
            win.tabs.forEach(function(tab) {
                if ( tab != undefined && tab.url.indexOf('http') == 0 ) {
                    chrome.tabs.sendMessage(tab.id, {type: "helper-change-shortcut", shortcut: shortcutName, key: key});
                }
            });
        });
    });
}

// On document load
$(document).ready(function() {
    // show tabs
    restore_options();

    $("#keycode-dialog").on('show', function() {
        keysStartListening();
    }).on('hide', function() {
        keysStopListening();
    });

    $("#shortcutSave").click(function() {
        var key = $("#shortKeyActivate").html();
        $("#keyActivate").html(key);
        window.localStorage.keyActivate = key;
        changeShortcut('activate', key);

        $("#keycode-dialog").modal('hide');
    });

    $("#shortcutDisable").click(function() {
        $("#keyActivate").html("none");
        window.localStorage.keyActivate = "none";

        $("#keycode-dialog").modal('hide');
    });

    $("#saveButton").click(function() { save_options() });

    FlattrLoader.setup();

});


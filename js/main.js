locationHashChanged();
window.addEventListener("hashchange", locationHashChanged, false);
function locationHashChanged() {
    if (location.hash === "") {
        location.hash = "#quick-reports";
    }
    if (location.hash === "#quick-reports") {
        document.getElementById("quick-reports-panel").className = "tabSection";;
        document.getElementById("my-folders-panel").className = "invisibleSection";
        document.getElementById("my-team-folders-panel").className = "invisibleSection";
        document.getElementById("public-folders-panel").className = "invisibleSection";
        document.querySelector(".tabs ul >li:nth-child(1)").className = "selectedTab";
        document.querySelector(".tabs ul >li:nth-child(2)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(3)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(4)").className = "tab";
    }
    if (location.hash === "#my-folders") {
        document.getElementById("quick-reports-panel").className = "invisibleSection";;
        document.getElementById("my-folders-panel").className = "tabSection";
        document.getElementById("my-team-folders-panel").className = "invisibleSection";
        document.getElementById("public-folders-panel").className = "invisibleSection";
        document.querySelector(".tabs ul >li:nth-child(1)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(2)").className = "selectedTab";
        document.querySelector(".tabs ul >li:nth-child(3)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(4)").className = "tab";
    }
    if (location.hash === "#my-team-folders") {
        document.getElementById("quick-reports-panel").className = "invisibleSection";;
        document.getElementById("my-folders-panel").className = "invisibleSection";
        document.getElementById("my-team-folders-panel").className = "tabSection";
        document.getElementById("public-folders-panel").className = "invisibleSection";
        document.querySelector(".tabs ul >li:nth-child(1)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(2)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(3)").className = "selectedTab";
        document.querySelector(".tabs ul >li:nth-child(4)").className = "tab";
    }
    if (location.hash === "#public-folders") {
        document.getElementById("quick-reports-panel").className = "invisibleSection";;
        document.getElementById("my-folders-panel").className = "invisibleSection";
        document.getElementById("my-team-folders-panel").className = "invisibleSection";
        document.getElementById("public-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(1)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(2)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(3)").className = "tab";
        document.querySelector(".tabs ul >li:nth-child(4)").className = "selectedTab";
    }
}

var xhr = new XMLHttpRequest();
xhr.open('GET', './data/config.json');

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        var status = xhr.status;
        alert(status);
        if ((status >= 200 && status < 300) || status === 304) {
            alert("hello!");
            var jsonData = JSON.parse(xhr.responseText);
            document.getElementById("notification").className = "notifications";
            document.getElementById("notification").innerHTML = jsonData.notification;


        } else {

            console.log(xhr.responseText);

        }

    }

}

xhr.send(null);

/*
function quickReportsClick() {
    window.location.hash = 'panel-' + id.replace('#', '');
}
function myFoldersClick() {
    if (history.pushState) {
        history.pushState(null, null, '#my-folders');
    }
    else {
        location.hash = '#my-folders';
    }
}
function myTeamFoldersClick() {
    if (history.pushState) {
        history.pushState(null, null, '#my-team-folders');
    }
    else {
        location.hash = '#my-team-folders';
    }
}
function publicFoldersClick() {
    if (history.pushState) {
        history.pushState(null, null, '#public-folders');
    }
    else {
        location.hash = '#public-folders';
    }
}*/
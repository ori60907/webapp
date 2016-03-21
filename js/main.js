
/*start code*/

locationHashChanged();




/*======================
    tabs switching script
========================*/

/** upon hash chainging-
  * switch the tab */
UTILS.addEvent(window, "hashchange", locationHashChanged);
function locationHashChanged() {

    if (location.hash === "") {
        location.hash = "#quick-reports";
    }
    if (location.hash === "#quick-reports") {
        UTILS.resetTabs();
        document.getElementById("quick-reports-panel").className = "tabSection";;
        document.querySelector(".tabs ul >li:nth-child(1)").className = "selectedTab";
        document.getElementById("quick-reports-panel").focus();
    }
    if (location.hash === "#my-folders") {
        UTILS.resetTabs();
        document.getElementById("my-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(2)").className = "selectedTab";
        document.getElementById("my-folders-panel").focus();
    }
    if (location.hash === "#my-team-folders") {
        UTILS.resetTabs();
        document.getElementById("my-team-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(3)").className = "selectedTab";
        document.getElementById("my-team-folders-panel").focus();
    }
    if (location.hash === "#public-folders") {
        UTILS.resetTabs();
        document.getElementById("public-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(4)").className = "selectedTab";
        document.getElementById("public-folders-panel").focus();
    }
}

/*tabs switching with keyboard*/
UTILS.addEvent(document,"keydown",keyboardPress);
function keyboardPress(e){
    switch (e.keyCode) {
        case 37: // left
            location.hash = UTILS.getLeftTab();
            break;

        case 39://right
            location.hash = UTILS.getRightTab();
            break;
    }
}


/*======================
    get notifications from config.json
========================*/
var ajaxUrl = './data/config.json';
var ajaxMethod = 'GET';
var ajaxOptions={method:ajaxMethod, done:ajaxGetNotifications};
UTILS.ajax(ajaxUrl,ajaxOptions)
/*var xhr = new XMLHttpRequest();

xhr.open('GET', './data/config.json');
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        var status = xhr.status;
        if ((status >= 200 && status < 300) || status === 304) {
            try{
                
            }
            catch(err){
                console.log(err.message);
            }
           
        } else {

            console.log(xhr.responseText);
        }
    }
}
xhr.send(null);*/
var ajaxGetNotifications = function (xhr, res) {
    var jsonData = res;
    alert(res);
    var xhrres = xhr.responseText;
    alert(xhrres);
    document.getElementById("notification").innerHTML = jsonData.notification;
    document.getElementById("notification").className = "notifications notificationsShow";
};



/*======================
    load dropdowns & form content
========================*/
updateDropDowns();
updateForm();


/*======================
    settings button script
========================*/

document.querySelector('.settingsBtn').addEventListener("click", settingsBtnClick,false);

function settingsBtnClick() {
    document.querySelector('#siteName1').focus();
}

/*======================
    save button script
========================*/

document.querySelector('#saveBtn1').addEventListener("click", saveBtnClick, false);


function validateUrl(url) {

    var urlPattern = new RegExp("(http|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    if (!urlPattern.test(url)) {
        return false;
    }
    return true;
}

function saveBtnClick() {
    var siteName1 = document.querySelector('#siteName1');
    var siteUrl1 = document.querySelector('#siteUrl1');
    var siteName2 = document.querySelector('#siteName2');
    var siteUrl2 = document.querySelector('#siteUrl2');
    var siteName3 = document.querySelector('#siteName3');
    var siteUrl3 = document.querySelector('#siteUrl3');
    var errorElemnt = null;
    var reportIsValid = true;
    var jsonObj = { quickReports: [] };
    clearErrors();
    //check first report
    if (siteName1.value!="" || siteUrl1.value!="")
    {
        if (siteName1.value == "") {
            errorElemnt = siteName1;
            siteName1.className = "textInput textInputError";
            reportIsValid = false;
        }
        else {
            siteName1.className = "textInput";
        }
        if (validateUrl(siteUrl1.value) == false) {
            siteUrl1.className = "textInput textInputError";
            if (errorElemnt == null)
                errorElemnt = siteUrl1;
            reportIsValid = false;
        }
        else {
            siteUrl1.className = "textInput";
        }
        if (reportIsValid)
            jsonObj.quickReports.push({ "Name": siteName1.value, "Url": siteUrl1.value });
    }

    //check second report
    
    reportIsValid = true;
    if (siteName2.value != "" || siteUrl2.value != "") {
        if (siteName2.value == "") {
            if (errorElemnt==null)
                errorElemnt = siteName2;
            siteName2.className = "textInput textInputError";
            reportIsValid = false;
        }
        else {
            siteName2.className = "textInput";
        }
        if (validateUrl(siteUrl2.value) == false) {
            siteUrl2.className = "textInput textInputError";
            if (errorElemnt == null)
                errorElemnt = siteUrl2;
            reportIsValid = false;
        }
        else {
            siteUrl2.className = "textInput";
        }
        if (reportIsValid)
            jsonObj.quickReports.push({ "Name": siteName2.value, "Url": siteUrl2.value });
    }

    //check third report

    reportIsValid = true;
    if (siteName3.value != "" || siteUrl3.value != "") {
        if (siteName3.value == "") {
            if (errorElemnt == null)
                errorElemnt = siteName3;
            siteName3.className = "textInput textInputError";
            reportIsValid = false;
        }
        else {
            siteName3.className = "textInput";
        }
        if (validateUrl(siteUrl3.value) == false) {
            siteUrl3.className = "textInput textInputError";
            if (errorElemnt == null)
                errorElemnt = siteUrl3;
            reportIsValid = false;
        }
        else {
            siteUrl3.className = "textInput";
        }
        if (reportIsValid)
            jsonObj.quickReports.push({ "Name": siteName2.value, "Url": siteUrl3.value });
    }
    if (errorElemnt != null){
        errorElemnt.focus();
        (errorElemnt.nextElementSibling).hidden = false;
    }
    else {
        //save the data in localstorage
        localStorage.setItem('JsonData', JSON.stringify(jsonObj));
        document.querySelector('#settings-checkbox').checked = false;
        updateDropDowns();
    }
}

document.querySelector("#siteName1").addEventListener("input", function () {
    if (document.querySelector("#siteName1").value != "") {
        document.querySelector("#siteName1").className = "textInput";
        document.querySelector("#siteName1").nextElementSibling.hidden = true;
    }
}, false);
document.querySelector("#siteUrl1").addEventListener("input", function () {
    if (validateUrl(document.querySelector("#siteUrl1").value)) {
        document.querySelector("#siteUrl1").className = "textInput";
        document.querySelector("#siteUrl1").nextElementSibling.hidden = true;
    }
}, false);
document.querySelector("#siteName2").addEventListener("input", function () {
    if (document.querySelector("#siteName2").value != "") {
        document.querySelector("#siteName2").className = "textInput";
        document.querySelector("#siteName2").nextElementSibling.hidden = true;
    }
}, false);
document.querySelector("#siteUrl2").addEventListener("input", function () {
    if (validateUrl(document.querySelector("#siteUrl2").value)) {
        document.querySelector("#siteUrl2").className = "textInput";
        document.querySelector("#siteUrl2").nextElementSibling.hidden = true;
    }
}, false);
document.querySelector("#siteName3").addEventListener("input", function () {
    if (document.querySelector("#siteName3").value != "") {
        document.querySelector("#siteName3").className = "textInput";
        document.querySelector("#siteName3").nextElementSibling.hidden = true;
    }
}, false);
document.querySelector("#siteUrl3").addEventListener("input", function () {
    if (validateUrl(document.querySelector("#siteUrl3").value)) {
        document.querySelector("#siteUrl3").className = "textInput";
        document.querySelector("#siteUrl3").nextElementSibling.hidden = true;
    }
}, false);

function clearErrors() {
    document.querySelector("#siteName1").className = "textInput";
    document.querySelector("#siteName1").nextElementSibling.hidden = true;
    document.querySelector("#siteUrl1").className = "textInput";
    document.querySelector("#siteUrl1").nextElementSibling.hidden = true;
    document.querySelector("#siteName2").className = "textInput";
    document.querySelector("#siteName2").nextElementSibling.hidden = true;
    document.querySelector("#siteUrl2").className = "textInput";
    document.querySelector("#siteUrl2").nextElementSibling.hidden = true;
    document.querySelector("#siteName3").className = "textInput";
    document.querySelector("#siteName3").nextElementSibling.hidden = true;
    document.querySelector("#siteUrl3").className = "textInput";
    document.querySelector("#siteUrl3").nextElementSibling.hidden = true;
}


/*======================
    update select script
========================*/

function updateDropDowns() {
    if (localStorage.getItem('JsonData') != null) {
        var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
        var quickReports = jsonObj.quickReports;
        var quickReportsSelect = document.querySelector('#quick-reports-panel select');
        var quickReportsLength = quickReportsSelect.length;
        for (var i = 0; i < quickReportsLength; i++) {
            quickReportsSelect.remove(0);
        }
        for (var i = 0; i < quickReports.length; i++) {
            var option = document.createElement("option");
            option.text = quickReports[i].Name;
            option.value = quickReports[i].Url;
            quickReportsSelect.add(option);
            //update the form
            document.querySelector('#siteName' + (i+1)).value = quickReports[i].Name;
            document.querySelector('#siteUrl' + (i + 1)).value = quickReports[i].Url;
        }
        updateQRIframe();
    }
}
function updateForm() {
    if (localStorage.getItem('JsonData') != null) {
        var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
        var quickReports = jsonObj.quickReports;
        for (var i = 0; i < quickReports.length; i++) {
            document.querySelector('#siteName' + (i + 1)).value = quickReports[i].Name;
            document.querySelector('#siteUrl' + (i + 1)).value = quickReports[i].Url;
        }
    }
}
/*======================
    update iframe script
========================*/

document.querySelector("#quick-reports-panel select").addEventListener("change", updateQRIframe, false);

function updateQRIframe() {
    if (document.querySelector("#quick-reports-panel select").value != null && document.querySelector("#quick-reports-panel select").value != "") {
        document.querySelector("#quick-reports-panel>iframe").src = document.querySelector("#quick-reports-panel select").value;
        document.querySelector("#quick-reports-panel>iframe").hidden = false;
    }
    else
        document.querySelector("#quick-reports-panel>iframe").hidden = true;
}

/*======================
    expand Button script
========================*/
document.querySelector("#expBtn1").addEventListener("click", expandBtnQR, false);

function expandBtnQR() {
    if(document.querySelector("#quick-reports-panel>iframe").hidden == false)
    {
        if(document.querySelector("#quick-reports-panel>iframe").src != null && document.querySelector("#quick-reports-panel>iframe").src != "" )
        {
            window.open(document.querySelector("#quick-reports-panel>iframe").src);
        }

    }
}


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

/*start code*/


var myfoldersurl="http://netcraft.co.il";
var publicfoldersurl = "http://www.mako.co.il";
/*======================
    load dropdowns & form content
========================*/
UTILS.addEvent(window, "hashchange", locationHashChanged);
UTILS.addEvent(window, "load", pageLoad);
function pageLoad() {
    loadMenuNotification();
    updateDropDowns();
    updateForm();
    TFupdateDropDowns();
    TFupdateForm();
    if (localStorage.getItem('lastTab') != null) {
        location.hash = localStorage.getItem('lastTab');
    }
    locationHashChanged();
}



/*======================
    tabs switching script
========================*/

/** upon hash chainging-
  * switch the tab */

function locationHashChanged() {
    if (location.hash === "") {
        location.hash = "#quick-reports";
    }
    if (location.hash === "#quick-reports") {
        UTILS.resetTabs();
        document.getElementById("quick-reports-panel").className = "tabSection";;
        document.querySelector(".tabs ul >li:nth-child(1)").className = "selectedTab";
        document.getElementById("quick-reports-panel").focus();
        updateQRIframe();
        localStorage.setItem('lastTab', "quick-reports");

    }
    if (location.hash === "#my-folders") {
        UTILS.resetTabs();
        document.getElementById("my-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(2)").className = "selectedTab";
        document.getElementById("my-folders-panel").focus();
        document.querySelector("#my-folders-panel>iframe").src = myfoldersurl;
        localStorage.setItem('lastTab', "my-folders");
    }
    if (location.hash === "#my-team-folders") {
        UTILS.resetTabs();
        document.getElementById("my-team-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(3)").className = "selectedTab";
        document.getElementById("my-team-folders-panel").focus();
        updateTFIframe();
        localStorage.setItem('lastTab', "my-team-folders");
    }
    if (location.hash === "#public-folders") {
        UTILS.resetTabs();
        document.getElementById("public-folders-panel").className = "tabSection";
        document.querySelector(".tabs ul >li:nth-child(4)").className = "selectedTab";
        document.getElementById("public-folders-panel").focus();
        document.querySelector("#public-folders-panel>iframe").src = publicfoldersurl;
        localStorage.setItem('lastTab', "public-folders");
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
function loadMenuNotification() {
    var ajaxUrl = './data/config.json';
    var ajaxMethod = 'GET';

    var ajaxGetMenuNotifications = function (res) {
        var jsonData = res;
        UTILS.addNotification("FileNotification", jsonData.notification);
        navSelectionArray = document.querySelectorAll(".nav-section");
        quickActionsArray = jsonData.quickActions;
        for (i = 0; i < navSelectionArray.length; i++) {
            alert(quickActionsArray[i]);
            navSelectionArray[i].querySelector("p").innerHTML = quickActionsArray[i].label;
            navSelectionArray[i].style.backgroundImage = "url('../img/icons/" + quickActionsArray[i].icon + ".png')";
            navSelectionArray[i].querySelector(".menu-caption p").innerHTML = quickActionsArray[i].actionsLabel;
            var actionList = navSelectionArray[i].querySelector(".action-list");
            actionList.innerHTML = "";
            var actionsArray=quickActionsArray[i].actions;
            for (j = 0; j < actionsArray.length; j++) {
                var newLi = document.createElement("LI");
                newLi.innerHTML = "<a href='" + actionsArray[j].url + "'>" + actionsArray[j].label + "</a>";
                actionList.appendChild(newLi);
            }
        }
    };
    var ajaxOptions = { method: ajaxMethod, done: ajaxGetMenuNotifications };
    UTILS.ajax(ajaxUrl, ajaxOptions)
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
}





/*======================
    settings button script
========================*/

//document.querySelector('.settingsBtn').addEventListener("click", settingsBtnClick,false);
UTILS.addEvent(document.querySelectorAll('.settingsBtn')[0], "click", settingsBtnClick);
UTILS.addEvent(document.querySelectorAll('.settingsBtn')[1], "click", settingsBtnClick);
function settingsBtnClick() {
    var tabId= this.parentNode.parentNode.id;
    if (tabId == "my-team-folders-panel") {
        document.querySelector('#TFsiteName1').focus();
    }
    else {
       document.querySelector('#siteName1').focus();
    }
    
}

/*======================
    save button script
========================*/

//document.querySelector('#saveBtn1').addEventListener("click", saveBtnClick, false);
UTILS.addEvent(document.querySelector('#saveBtn1'), "click", saveBtnClick);

function saveBtnClick() {
    var siteName1 = document.querySelector('#siteName1');
    var siteUrl1 = document.querySelector('#siteUrl1');
    var siteName2 = document.querySelector('#siteName2');
    var siteUrl2 = document.querySelector('#siteUrl2');
    var siteName3 = document.querySelector('#siteName3');
    var siteUrl3 = document.querySelector('#siteUrl3');
    var errorElemnt = {errElmnt: null };
    var reportIsValid = true;
    var quickReports = [];
    clearErrors();
    //check first report
    if (UTILS.checkReport(siteName1, siteUrl1, errorElemnt))
        quickReports.push({ "Name": siteName1.value, "Url": siteUrl1.value });

    //check second report
    if (UTILS.checkReport(siteName2, siteUrl2, errorElemnt))
        quickReports.push({ "Name": siteName2.value, "Url": siteUrl2.value });

    //check third report
    if (UTILS.checkReport(siteName3, siteUrl3, errorElemnt))
        quickReports.push({ "Name": siteName3.value, "Url": siteUrl3.value });

    if (errorElemnt.errElmnt!=null) {
        errorElemnt.errElmnt.focus();
        (errorElemnt.errElmnt.nextElementSibling).hidden = false;
    }
    else {
        //save the data in localstorage
        if (localStorage.getItem('JsonData') != null) {
            //JsonData already exist
            var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
            jsonObj.quickReports = quickReports;
            localStorage.setItem('JsonData', JSON.stringify(jsonObj));
        }
        else {
            //JsonData does not exist
            var jsonObj = { quickReports: quickReports };
            localStorage.setItem('JsonData', JSON.stringify(jsonObj));
        }
        document.querySelector('#settings-checkbox').checked = false;
        updateDropDowns();
        updateForm();
    }
}
//for the TF
UTILS.addEvent(document.querySelector('#TFsaveBtn1'), "click", tfSaveBtnClick);

function tfSaveBtnClick() {
    var siteName1 = document.querySelector('#TFsiteName1');
    var siteUrl1 = document.querySelector('#TFsiteUrl1');
    var siteName2 = document.querySelector('#TFsiteName2');
    var siteUrl2 = document.querySelector('#TFsiteUrl2');
    var siteName3 = document.querySelector('#TFsiteName3');
    var siteUrl3 = document.querySelector('#TFsiteUrl3');
    var errorElemnt = { errElmnt: null };
    var reportIsValid = true;
    var teamFolders = [];
    clearErrors();
    //check first report
    if (UTILS.checkReport(siteName1, siteUrl1, errorElemnt))
        teamFolders.push({ "Name": siteName1.value, "Url": siteUrl1.value });

    //check second report
    if (UTILS.checkReport(siteName2, siteUrl2, errorElemnt))
        teamFolders.push({ "Name": siteName2.value, "Url": siteUrl2.value });

    //check third report
    if (UTILS.checkReport(siteName3, siteUrl3, errorElemnt))
        teamFolders.push({ "Name": siteName3.value, "Url": siteUrl3.value });

    if (errorElemnt.errElmnt != null) {
        errorElemnt.errElmnt.focus();
        (errorElemnt.errElmnt.nextElementSibling).hidden = false;
    }
    else {
        //save the data in localstorage
        if (localStorage.getItem('JsonData') != null) {
            //JsonData already exist
            var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
            jsonObj.teamFolders = teamFolders;
            localStorage.setItem('JsonData', JSON.stringify(jsonObj));
        }
        else {
            //JsonData does not exist
            var jsonObj = { teamFolders: teamFolders };
            localStorage.setItem('JsonData', JSON.stringify(jsonObj));
        }
        document.querySelector('#TFsettings-checkbox').checked = false;
        TFupdateDropDowns();
        TFupdateForm();
    }
}
//check validity while typing
document.querySelector("#siteName1").addEventListener("input", validateSiteName, false);
document.querySelector("#siteName2").addEventListener("input", validateSiteName, false);
document.querySelector("#siteName3").addEventListener("input", validateSiteName, false);
document.querySelector("#TFsiteName1").addEventListener("input", validateSiteName, false);
document.querySelector("#TFsiteName2").addEventListener("input", validateSiteName, false);
document.querySelector("#TFsiteName3").addEventListener("input", validateSiteName, false);
function validateSiteName() {
    if (this.value != "") {
        this.className = "textInput";
        this.nextElementSibling.hidden = true;
    }
}
document.querySelector("#siteUrl1").addEventListener("input", validateSiteUrl, false);
document.querySelector("#siteUrl2").addEventListener("input", validateSiteUrl, false);
document.querySelector("#siteUrl3").addEventListener("input", validateSiteUrl, false);
document.querySelector("#TFsiteUrl1").addEventListener("input", validateSiteUrl, false);
document.querySelector("#TFsiteUrl2").addEventListener("input", validateSiteUrl, false);
document.querySelector("#TFsiteUrl3").addEventListener("input", validateSiteUrl, false);
function validateSiteUrl() {
    if (UTILS.validateUrl(this.value)) {
        this.className = "textInput";
        this.nextElementSibling.hidden = true;
    }
}





function clearErrors() {
    clearInputError("#siteName1");
    clearInputError("#siteUrl1");
    clearInputError("#siteName2");
    clearInputError("#siteUrl2");
    clearInputError("#siteName3");
    clearInputError("#siteUrl3");
    //for tf
    clearInputError("#TFsiteName1");
    clearInputError("#TFsiteUrl1");
    clearInputError("#TFsiteName2");
    clearInputError("#TFsiteUrl2");
    clearInputError("#TFsiteName3");
    clearInputError("#TFsiteUrl3");

}
function clearInputError(elemntId) {
    document.querySelector(elemntId).className = "textInput";
    document.querySelector(elemntId).nextElementSibling.hidden = true;
}


/*======================
    update select script
========================*/

function updateDropDowns() {
    if (localStorage.getItem('JsonData') != null) {
        var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
        var quickReports = jsonObj.quickReports;
        if (quickReports != null && quickReports != undefined) {
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
                document.querySelector('#siteName' + (i + 1)).value = quickReports[i].Name;
                document.querySelector('#siteUrl' + (i + 1)).value = quickReports[i].Url;
            }
            quickReportsSelect.selectedIndex = quickReportsSelect.length - 1;
            updateQRIframe();
        }
    }
}

//for TF
function TFupdateDropDowns() {
    if (localStorage.getItem('JsonData') != null) {
        var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
        var teamFolders = jsonObj.teamFolders;
        if (teamFolders != null && teamFolders != undefined) {
            var teamFoldersSelect = document.querySelector('#my-team-folders-panel select');
            var length = teamFoldersSelect.length;
            for (var i = 0; i < length; i++) {
                teamFoldersSelect.remove(0);
            }
            for (var i = 0; i < teamFolders.length; i++) {
                var option = document.createElement("option");
                option.text = teamFolders[i].Name;
                option.value = teamFolders[i].Url;
                teamFoldersSelect.add(option);
                //update the form
                document.querySelector('#TFsiteName' + (i + 1)).value = teamFolders[i].Name;
                document.querySelector('#TFsiteUrl' + (i + 1)).value = teamFolders[i].Url;
            }
            teamFoldersSelect.selectedIndex = teamFoldersSelect.length - 1;
            updateTFIframe();
        }
    }
}

function updateForm() {
    if (localStorage.getItem('JsonData') != null) {
        var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
        var quickReports = jsonObj.quickReports;
        if (quickReports != null && quickReports != undefined) {
            for (var i = 0; i < 3; i++) {
                document.querySelector('#siteName' + (i + 1)).value = "";
                document.querySelector('#siteUrl' + (i + 1)).value = "";
            }
            for (var i = 0; i < quickReports.length; i++) {
                document.querySelector('#siteName' + (i + 1)).value = quickReports[i].Name;
                document.querySelector('#siteUrl' + (i + 1)).value = quickReports[i].Url;
            }
        }
    }
}

//for TF
function TFupdateForm() {
    if (localStorage.getItem('JsonData') != null) {
        var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
        var teamFolders = jsonObj.teamFolders;
        if (teamFolders != null && teamFolders != undefined) {
            for (var i = 0; i < 3; i++) {
                document.querySelector('#TFsiteName' + (i + 1)).value = "";
                document.querySelector('#TFsiteUrl' + (i + 1)).value = "";
            }
            for (var i = 0; i < teamFolders.length; i++) {
                document.querySelector('#TFsiteName' + (i + 1)).value = teamFolders[i].Name;
                document.querySelector('#TFsiteUrl' + (i + 1)).value = teamFolders[i].Url;
            }
        }
    }
}

/*======================
    update iframe script
========================*/

UTILS.addEvent(document.querySelector("#quick-reports-panel select"), "change", updateQRIframe);
function updateQRIframe() {
    var iframe = document.querySelector("#quick-reports-panel>iframe");
    var select = document.querySelector("#quick-reports-panel select");
    if (select.value != null && select.value != "") {
        iframe.src = select.value;
        iframe.hidden = false;
    }
    else
        iframe.hidden = true;
}

//for tf
UTILS.addEvent(document.querySelector("#my-team-folders-panel select"), "change", updateTFIframe);
function updateTFIframe() {
    var iframe = document.querySelector("#my-team-folders-panel>iframe");
    var select = document.querySelector("#my-team-folders-panel select");
    if (select.value != null && select.value != "") {
        iframe.src = select.value;
        iframe.hidden = false;
    }
    else
        iframe.hidden = true;
}

/*======================
    expand Button script
========================*/
//document.querySelector("#expBtn1").addEventListener("click", expandBtnQR, false);
UTILS.addEvent(document.querySelector('#expBtn1'), "click", expandBtnQR);
UTILS.addEvent(document.querySelector('#expBtn2'), "click", expandBtnQR);
UTILS.addEvent(document.querySelector('#expBtn3'), "click", expandBtnQR);
UTILS.addEvent(document.querySelector('#expBtn4'), "click", expandBtnQR);
function expandBtnQR() {
    var panelId = this.parentNode.parentNode.id;
    if(document.querySelector("#"+panelId+">iframe").hidden == false)
    {
        if (document.querySelector("#" + panelId + ">iframe").src != null && document.querySelector("#" + panelId + ">iframe").src != "")
        {
            window.open(document.querySelector("#" + panelId + ">iframe").src);
        }

    }
}


/*======================
    cyclic tab switching script
========================*/
UTILS.addEvent(document.querySelector('#saveBtn1'), "keydown", saveBtnKeyDown);
function saveBtnKeyDown(e) {
    var keyCode = e.keyCode;
    if (keyCode==9){
        document.querySelector("#siteName1").focus();
    }
    
}
//for TF
UTILS.addEvent(document.querySelector('#TFsaveBtn1'), "keydown", saveBtnKeyDown);
function saveBtnKeyDown(e) {
    var keyCode = e.keyCode;
    if (keyCode == 9) {
        document.querySelector("#TFsiteName1").focus();
    }

}

/*======================
    enter & escape button press script
========================*/
UTILS.addEvent(document.querySelector('#siteName1'), "keydown", enterEscapePress);
UTILS.addEvent(document.querySelector('#siteUrl1'), "keydown", enterEscapePress);
UTILS.addEvent(document.querySelector('#siteName2'), "keydown", enterEscapePress);
UTILS.addEvent(document.querySelector('#siteUrl2'), "keydown", enterEscapePress);
UTILS.addEvent(document.querySelector('#siteName3'), "keydown", enterEscapePress);
UTILS.addEvent(document.querySelector('#siteUrl3'), "keydown", enterEscapePress);
UTILS.addEvent(document.querySelector('#TFsiteName1'), "keydown", TFenterEscapePress);
UTILS.addEvent(document.querySelector('#TFsiteUrl1'), "keydown", TFenterEscapePress);
UTILS.addEvent(document.querySelector('#TFsiteName2'), "keydown", TFenterEscapePress);
UTILS.addEvent(document.querySelector('#TFsiteUrl2'), "keydown", TFenterEscapePress);
UTILS.addEvent(document.querySelector('#TFsiteName3'), "keydown", TFenterEscapePress);
UTILS.addEvent(document.querySelector('#TFsiteUrl3'), "keydown", TFenterEscapePress);

function enterEscapePress(e) {
    switch (e.keyCode) {
        case 13: // enter
            saveBtnClick();
            break;

        case 27://escape
            document.querySelector('#settings-checkbox').checked = false;
            break;
    }
}
function TFenterEscapePress(e) {
    switch (e.keyCode) {
        case 13: // enter
            tfSaveBtnClick();
            break;

        case 27://escape
            document.querySelector('#TFsettings-checkbox').checked = false;
            break;
    }
}

/*======================
    search reports script
========================*/
UTILS.addEvent(document.querySelector('#serchBoxInput'), "keydown", searchBoxEnterPress);
//prevent form def submitting
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
}, false);
function searchBoxEnterPress(e) {
    switch (e.keyCode) {
        case 13: // enter
            //search for reports
            var val = this.value;
            if (val != null && val != undefined &&val!="") {
                if (localStorage.getItem('JsonData') != null) {
                    var jsonObj = JSON.parse(localStorage.getItem('JsonData'));
                    var quickReports = jsonObj.quickReports;
                    var teamFolders = jsonObj.teamFolders;
                    if (quickReports != null && quickReports != undefined) {
                        for (i = 0; i < quickReports.length;i++) {
                            if (quickReports[i].Name.indexOf(val) != -1) {
                                location.hash="quick-reports";
                                document.querySelector('#quick-reports-panel select').selectedIndex = i;
                                UTILS.removeNotification("ReportNotification");
                                return true;
                            }
                        }
                    }
                    if (teamFolders != null && teamFolders != undefined) {
                        for (i = 0; i < teamFolders.length; i++) {
                            if (teamFolders[i].Name.indexOf(val) != -1) {
                                location.hash = "my-team-folders";
                                document.querySelector('#my-team-folders-panel select').selectedIndex = i;
                                UTILS.removeNotification("ReportNotification");
                                return true;
                            }
                        }
                    }
                }
                
            }
            UTILS.addNotification("ReportNotification", "The searched report " + val + " was not found.");
            break;
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
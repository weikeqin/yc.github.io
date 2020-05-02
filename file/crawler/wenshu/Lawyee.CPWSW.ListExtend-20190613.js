function createGuid() {
    return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
}

function ref() {
    var guid = createGuid() + createGuid() + "-" + createGuid() + "-" + createGuid() + createGuid() + "-" + createGuid() + createGuid() + createGuid();
    $("#txthidGuid").val(guid);
    $("#divYzmImg").html("<img alt="点击刷新验证码！" name="validateCode" id="ImgYzm" onclick="ref()" title="点击切换验证码" src="/ValiCode/CreateCode/?guid=" + guid + "" style="cursor: pointer;">")
}

function showBg() {
    var bh = $("body").height();
    var bw = $("body").width();
    $("#fullbg").css({height: bh, width: bw, display: "block"});
    $("#dialog").show()
}

function closeBg() {
    $("#fullbg,#dialog").hide()
}

$(function () {
    WebsiteLog.Config.Util = "Country,Area,City,Region,IP,Source,StartYear,EndYear,StartMonth,EndMonth,StartDay,EndDay,Device,PageURL,CreateDateTime";
    WebsiteLog.Config.Mode = "KeyWordLog,WordLog";
    WebsiteLog.Init();
    $("#divtdcApp").MobileAppQrCode()
});

function openApp() {
    $("#divtdcApp").show()
}

function CollectCondition() {
    $.ajax({
        url: "/Content/CheckLogin", type: "POST", async: false, data: {}, success: function (res) {
            if (res == "0") {
                SaveUrl();
                window.location = "/User/RegisterAndLogin?Operate=1"
            } else {
                var $conditions = $(".removeCondtion");
                var conditions = "";
                $conditions.each(function () {
                    conditions += $(this).attr("val") + "&"
                });
                conditions = conditions.substr(0, conditions.length - 1);
                if (conditions.split("&").length >= 2) {
                    var conArry = conditions.split("&");
                    conditions = conArry[0] + conArry[1]
                }
                conditions = conditions.replace(/:/g, "为").replace(/&/g, "且");
                var dates = new Date();
                var _years = dates.getFullYear();
                var _months = dates.getMonth() + 1;
                var _days = dates.getDay();
                var _hours = dates.getHours();
                var _minutes = dates.getMinutes();
                var _seconds = dates.getSeconds();
                var _mill = dates.getMilliseconds();
                var nowTimes = _years + "" + _months + "" + _days + "" + _hours + "" + _minutes + "" + _seconds + "" + _mill;
                AddTemplate(conditions + nowTimes)
            }
        }
    })
}

function ClearSearchCondition() {
    var host = window.location.host;
    window.location.href = "http://" + host + "/list/list"
}

function AddTemplate(templateName) {
    if (templateName == "") {
        Lawyee.Tools.ShowMessage("请填写新模板名称!");
        return false
    } else {
        var url = window.location.href;
        url = decodeURI(url);
        var queryCondition = url.substr(url.indexOf("?") + 1);
        var lastQueryCount = $("#span_datacount").text();
        $.post("/User/AddTemplate", {
            "templateName": templateName,
            "queryCondition": queryCondition,
            "lastQueryCount": lastQueryCount
        }, function (data) {
            if (data == "1") {
                Lawyee.Tools.ShowMessage("添加成功!");
                $("#divQueryTemplate").hide();
                $("#NewTemplateTxt").val("");
                $("#TemplateName").val("")
            } else {
                if (data == "0") {
                    Lawyee.Tools.ShowMessage("添加失败!")
                } else {
                    Lawyee.Tools.ShowMessage("添加失败:" + data)
                }
            }
        })
    }
}

function Casefx(docid) {
    $.post("/CreateContentJS/CreateImage.aspx", {"action": "caseShare", "docid": docid}, function (data) {
        if (data == "数据错误") {
        } else {
            var objdata = $.parseJSON(data);
            if (objdata.code == "1") {
                window.open(objdata.url)
            }
        }
    })
}

function AddConditionToTemplate() {
    var row = List.Template.g.getSelectedRow();
    var id = row.id;
    var url = window.location.href;
    url = decodeURI(url);
    var queryCondition = url.substr(url.indexOf("?") + 1);
    var lastQueryCount = $("#span_datacount").text();
    $.post("/User/AddConditionToQueryTemplate", {
        "id": id,
        "queryCondition": queryCondition,
        "lastQueryCount": lastQueryCount
    }, function (data) {
        if (data == "1") {
            Lawyee.Tools.ShowMessage("收藏成功!");
            $("#divQueryTemplate").hide();
            $("#NewTemplateTxt").val("");
            $("#TemplateName").val("")
        } else {
            if (data == "0") {
                Lawyee.Tools.ShowMessage("收藏失败!")
            } else {
                Lawyee.Tools.ShowMessage("收藏失败:" + data)
            }
        }
    })
}

var List = {
    Template: {
        g: null, BindTemplateList: function () {
            List.Template.g = $("#divTemplateList").quiGrid({
                columns: [{
                    display: "模板名称",
                    name: "TemplateName",
                    align: "left",
                    width: 350
                }, {display: "添加时间", name: "AddTime", align: "center", width: 140}],
                url: "/User/GetTemplateList",
                pageSize: 10,
                params: [{name: "TemplateName", value: $("#TemplateName").val()}, {
                    name: "StartTime",
                    value: $("#sta_date").val()
                }, {name: "EndTime", value: $("#end_date").text()}, {name: "RequireOperate", value: 0}],
                sortName: "AddTime",
                rownumbers: true,
                checkbox: true,
                height: 330,
                width: "100%",
                onBeforeChangeColumnWidth: function () {
                    return false
                }
            })
        }, Search: function () {
            List.Template.g.setOptions({
                params: [{
                    name: "TemplateName",
                    value: $("#TemplateName").val()
                }, {name: "StartTime", value: $("#sta_date").val()}, {
                    name: "EndTime",
                    value: $("#end_date").text()
                }, {name: "RequireOperate", value: 0}]
            });
            List.Template.g.setNewPage(1);
            List.Template.g.loadData()
        }
    }, Package: {
        g: null, BindPackageList: function () {
            List.Package.g = $("#divPackageList").quiGrid({
                columns: [{
                    display: "案例包",
                    name: "PackageName",
                    align: "left",
                    width: 350
                }, {display: "添加时间", name: "AddTime", align: "center", width: 140}],
                url: "/User/GetPackageList",
                pageSize: 10,
                params: [{name: "packageName", value: $("#PackageName").val()}, {
                    name: "startTime",
                    value: $("#sta_date").val()
                }, {name: "endTime", value: $("#end_date").text()}, {name: "requireOperate", value: 0}],
                sortName: "AddTime",
                rownumbers: true,
                checkbox: true,
                height: 340,
                width: "100%",
                onBeforeChangeColumnWidth: function () {
                    return false
                }
            })
        }, Search: function () {
            List.Package.g.setOptions({
                params: [{
                    name: "packageName",
                    value: $("#PackageName").val()
                }, {name: "startTime", value: $("#sta_date").val()}, {
                    name: "endTime",
                    value: $("#end_date").text()
                }, {name: "requireOperate", value: 0}]
            });
            List.Package.g.setNewPage(1);
            List.Package.g.loadData()
        }
    }
};

function CollectCaseNew(id) {
    var $item = $("#" + id);
    var key = $item.attr("key");
    var unzipid = unzip(key);
    try {
        var realid = com.str.Decrypt(unzipid);
        if (realid == "") {
            setTimeout("CollectCaseNew('" + id + "')", 1000)
        } else {
            CollectCase($item, realid)
        }
    } catch (ex) {
        setTimeout("CollectCaseNew('" + id + "')", 1000)
    }
}

function CollectCase($item, docID) {
    var caseName = $item.attr("title");
    var caseCourt = $item.attr("caseCourt");
    var caseNumber = $item.attr("caseNumber");
    var judgeDate = $item.attr("judgeDate");
    $.ajax({
        url: "/Content/CheckLogin", type: "POST", async: false, data: {}, success: function (res) {
            if (res == "0") {
                SaveUrl();
                window.location = "/User/RegisterAndLogin?Operate=1"
            } else {
                var caseInfo = docID + "^" + caseName + "^" + caseCourt + "^" + caseNumber + "^" + judgeDate + "&";
                $("#hidCaseInfo").val(caseInfo);
                top.Dialog.confirm("是否收藏到新的案例包中？|提示|是否", function () {
                    var $conditions = $(".removeCondtion");
                    var conditions = "";
                    $conditions.each(function () {
                        conditions += $(this).attr("val") + "&"
                    });
                    conditions = conditions.substr(0, conditions.length - 1);
                    if (conditions.split("&").length >= 2) {
                        var conArry = conditions.split("&");
                        conditions = conArry[0] + conArry[1]
                    }
                    conditions = conditions.replace(/:/g, "为").replace(/&/g, "且");
                    var dates = new Date();
                    var _years = dates.getFullYear();
                    var _months = dates.getMonth() + 1;
                    var _days = dates.getDay();
                    var _hours = dates.getHours();
                    var _minutes = dates.getMinutes();
                    var _seconds = dates.getSeconds();
                    var _mill = dates.getMilliseconds();
                    var nowTimes = _years + "" + _months + "" + _days + "" + _hours + "" + _minutes + "" + _seconds + "" + _mill;
                    var pname = conditions + nowTimes;
                    AddPackage(pname)
                }, function () {
                    $("#divCasePackage").show();
                    List.Package.BindPackageList()
                })
            }
        }
    })
}

function AddPackage(packageName) {
    if (packageName == "") {
        Lawyee.Tools.ShowMessage("请填写新案例包名称!");
        return false
    } else {
        var caseInfo = $("#hidCaseInfo").val();
        $.post("/User/AddPackage", {"packageName": packageName, "caseInfo": caseInfo}, function (data) {
            if (data == "1") {
                Lawyee.Tools.ShowMessage("添加成功!");
                $("#NewPackageTxt").val("");
                $("#PackageName").val("")
            } else {
                if (data == "0") {
                    Lawyee.Tools.ShowMessage("添加失败!")
                } else {
                    Lawyee.Tools.ShowMessage("添加失败:" + data)
                }
            }
        })
    }
}

function AddCasesToPackage() {
    var row = List.Package.g.getSelectedRow();
    var id = row.id;
    var caseInfo = $("#hidCaseInfo").val();
    caseInfo = caseInfo.replace(/<span style="color:red">/g, "").replace(/<\ span>/g, "");
    $.post("/User/AddCasesToPackage", {"packageID": id, "caseInfo": caseInfo}, function (data) {
        if (data == "1") {
            Lawyee.Tools.ShowMessage("添加成功!");
            $("#divCasePackage").hide();
            $("#NewPackageTxt").val("");
            $("#PackageName").val("")
        } else {
            if (data == "0") {
                Lawyee.Tools.ShowMessage("添加失败!")
            } else {
                Lawyee.Tools.ShowMessage("添加失败:" + data)
            }
        }
    })
}

function DownLoadCaseNew(id) {
    var $item = $("#" + id);
    var key = $item.attr("key");
    var unzipid = unzip(key);
    try {
        var realid = com.str.Decrypt(unzipid);
        if (realid == "") {
            setTimeout("DownLoadCaseNew('" + id + "')", 1000)
        } else {
            DownLoadCase($item, realid)
        }
    } catch (ex) {
        setTimeout("DownLoadCaseNew('" + id + "')", 1000)
    }
}

function DownLoadCase($item, id) {
    var caseInfo = id + "|" + $item.attr("title") + "|" + $item.attr("judgeDate");
    var thebody = document.body;
    var formid = "DownloadForm";
    var url = "/CreateContentJS/CreateListDocZip.aspx?action=1";
    var theform = document.createElement("form");
    theform.id = formid;
    theform.action = url;
    theform.method = "POST";
    theform.target = "_blank";
    var $conditions = $(".removeCondtion");
    var conditions = "";
    $conditions.each(function () {
        conditions += $(this).attr("val") + "&"
    });
    conditions = conditions.substr(0, conditions.length - 1);
    conditions = conditions.replace(/:/g, "为").replace(/&/g, "且");
    var theInput = document.createElement("input");
    theInput.type = "hidden";
    theInput.id = "conditions";
    theInput.name = "conditions";
    theInput.value = encodeURI(conditions);
    theform.appendChild(theInput);
    var theInput = document.createElement("input");
    theInput.type = "hidden";
    theInput.id = "docIds";
    theInput.name = "docIds";
    theInput.value = caseInfo;
    theform.appendChild(theInput);
    var theInput = document.createElement("input");
    theInput.type = "hidden";
    theInput.id = "keyCode";
    theInput.name = "keyCode";
    theInput.value = "";
    theform.appendChild(theInput);
    thebody.appendChild(theform);
    theform.submit()
}

var _fxxx = function (p, a, c, k, e, d) {
    e = function (c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!"".replace(/^/, String)) {
        while (c--) {
            d[e(c)] = k[c] || e(c)
        }
        k = [function (e) {
            return d[e]
        }];
        e = function () {
            return "\\w+"
        };
        c = 1
    }
    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c])
        }
    }
    return p
};

function de(str, count, strReplace) {
    var arrReplace = strReplace.split("|");
    for (var i = 0; i < count; i++) {
        str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arrReplace[i])
    }
    return str
}

function getKey() {
    eval(de('eval(_fxxx(\'e n(7){9 d=0;j(9 i=0;i</\></span>
var $ = window.jQuery;
try {
    window.socket = window.io();
}
catch (e) {}

var cookie = {
    data: {},
 
    load: function () {
        var the_cookie = document.cookie.split(';');
        if (the_cookie[0]) {
            this.data = JSON.parse(unescape(the_cookie[0]));
        }
        return this.data;
    },
 
    save: function (expires, path) {
        var d = expires || new Date(2020, 02, 02);
        var p = path || '/';
        document.cookie = escape(JSON.stringify(this.data))
                          + ';path=' + p
                          + ';expires=' + d.toUTCString();
    }
}

require(["libs/D2Bot"], function (D2BOTAPI) {
    var API = (typeof socket !== "undefined") ? socket : D2BOTAPI("localhost", "8080");
    var md5 = CryptoJS.MD5;

    (function enableBackToTop() {
        var backToTop = $('<a>', { id: 'back-to-top', href: '#top' });
        var icon = $('<i>', { class: 'icon-chevron-up' });

        backToTop.appendTo('body');
        icon.appendTo(backToTop);

        backToTop.hide();

        $(window).scroll(function () {
            if ($(this).scrollTop() > 150) {
                backToTop.fadeIn();
            }
            else {
                backToTop.fadeOut();
            }
        });

        backToTop.click(function (e) {
            e.preventDefault();

            $('body, html').animate({
                scrollTop: 0
            }, 600);
        });
    })()

    function initialize()
    {
        cookie.load();

        if (cookie.data.username && cookie.data.session) {
            API.emit('validate', cookie.data.username, cookie.data.session, function (err, valid) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (!valid) {
                    login("public", "public", function (loggedin) {
                        start(loggedin);
                    });
                } else {
                    start(true);
                }
            });
        } else {
            login("public", "public", function (loggedin) {
                start(loggedin);
            });
        }
    }

    function login(username, password, callback)
    {
        API.emit('login', username, password, function (err, result) {
            if (err) {
                console.log(err);
                return callback(false);
            }

            cookie.data.username = username;
            cookie.data.session = result;
            cookie.data.loggedin = (username !== "public") ? true : false;
            cookie.save();
            callback(cookie.data.loggedin);
        });        
    }

    var CurrentRealm;
    var CurrentGameType;
    var CurrentGameMode;
    var CurrentGameClass;
    var listOfAccounts = {};

    function showNotificaiton(text, perm)
    {
        var template = `<a class="` + (perm ? `always-there ` : "") + `ld-notify-card link border-top">
        <div class="d-flex no-block align-items-center p-10">
            <span class="btn btn-success btn-circle">
                <i class="ti-calendar"></i>
            </span>
            <div class="m-l-10">
                <h5 class="m-b-0">Notification</h5>
                <span class="mail-desc">` + text + `</span>
            </div>
        </div>
        </a>`;

        $('#ldNotify').append($(template));
        if ($('#ldNotifyDrop').is(":hidden")){
            $('#ldNotifyDrop').dropdown('toggle');
        }
    }

    function refreshList() {
        $("#itemsList").html("");
        addItemstoList();
    }

    function getItemDesc (desc) {
		var i, desc,
			stringColor = "<span class='color0'>";

		if (!desc) {
			return "";
		}

        desc = desc.split("\n");
        stringColor = "<span class='color0'>";

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = desc.length - 1; i >= 0; i -= 1) {
			if (desc[i].indexOf("Sell value: ") > -1) { // Remove sell value
				desc.splice(i, 1);

				i += 1;
			} else {
				if (desc[i].match(/^(ÿ|˙)c/)) {
					stringColor = desc[i].substring(0, 3);
				} else {
					desc[i] = stringColor + desc[i];
				}
			}

			desc[i] = desc[i].replace(/(ÿ|˙)c([0-9!"+<;.*])/g, "<span class='color$2'>");
			desc[i] = desc[i] + "</span>";
			if (stringColor == "<span class='color0'>") {	//What a dirty solution O.o
				desc[i] = desc[i] + "</span>";
			}
			
		}

		if (desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim();
		}

		desc = desc.join("<BR>");

		return desc;
	}


    function cleanDecription(description) {
        return getItemDesc(description.toString().split("$")[0]);
    }

    function $addItem(result) {
        var itemUID = result.description.split("$")[1];
        /*
            var htmlTemplate = '<div class="row itemsListitem">' + '<div class="span2 "><img class="ld-item" src="data:image/jpeg;base64, ' + result.image + '" alt="Red dot" /> 
            </div>' + '<div class="span5">' + cleanDecription(result.description) + '</div>' + '<div class="span5">' + CurrentRealm + "/" + result.account + "/" + result.character + "/{" + itemUID + '}' + "
            <br/>" + (result.lod ? "Lod" : "Classic") + "/" + (result.sc ? "Softcore" : "Hardcore") + "/" + (result.ladder ? "Ladder" : "NonLadder") + '</div>' + '</div><hr>';
        
        */
        var description = cleanDecription(result.description).split("<br/>");
        var title = description.shift()
        description = description.join("<br/>")

        result.realm = CurrentRealm.toLowerCase();
        result.itemid = itemUID;
        var templateid = CurrentRealm + "-" + result.account + "-" + result.character + "-" + itemUID;
        var htmlTemplate = `
        <div class="d-flex flex-row comment-row p-l-0 m-t-0 m-b-0" id="` + templateid + `">
            <div class="p-2 ld-img-col">
                <img src="data:image/jpeg;base64, ` + result.image + `" alt="user" class="ld-item">
            </div>
            <div class="comment-text w-100">
                 <h6 class="-medium">` + title + `</h6>
                <span class="m-b-15 d-block">` + description + `
                </span>
                <div class="comment-footer">
                    <div class="flex">
                        <span class="text-muted float-right">` + CurrentRealm + "/" + result.account + "/" + result.character + "/{" + itemUID + '}' + `</span>
                        <!--<button type="button" class="btn btn-cyan btn-sm">Helm</button>
                        <button type="button" class="btn btn-success btn-sm">Armor</button>-->
                    </div>
                </div>
            </div>
        </div>`;

        var $item = $(htmlTemplate);
        $item.data("itemData", result);
        $item.click(function () {
            $(this).toggleClass("selected");
        });
        $("#itemsList").append($item);
    }

    function buildregex(str) {
        if (str.length == 0) {
            return str;
        }

        var $str = str.split(" ");
        var $$str = "";
        for (var i in $str) {
            $$str += "(?=.*" + $str[i] + ")";
        }
        return $$str;
    }

    function addItemstoList() {
        function doQuery($account, $character, loadMoreItem) {
            API.emit("query", buildregex($("#searchItem").val().toLocaleLowerCase()), CurrentRealm, $account, $character, function (err, results) {
                if (err) console.log(err);
                var y = $(window).scrollTop();
                for (var i in results) {
                    $addItem(results[i]);
                }
                $(window).scrollTop(y);
                
                if (loadMoreItem) { 
                    loadMoreItem();
                }
            });
        }
        var charListid, ended;
        var account = $("#accountSelect").val();
        var character = $("#characterSelect").val();
        if (character == "Show All" && account == "Show All") {
            var accList = [];
            for (var i in listOfAccounts) {
                accList.push(i);
            }
            var accountListid = 0;
            charListid = 0;
            ended = false;
            window.loadMoreItem = function () {
                if (accountListid == accList.length) {
                    if (!ended) {
                        $("#itemsList").append("<div>End Of Items on Accounts</div>");
                        ended = true;
                        window.loadMoreItem = false;
                    }
                    return;
                }
                if (charListid == listOfAccounts[accList[accountListid]].length) {
                    accountListid = accountListid + 1;
                    charListid = 0;
                    return;
                }
                var acc = accList[accountListid];
                var char = listOfAccounts[accList[accountListid]][charListid];
                charListid = charListid + 1;
                doQuery(acc, char, window.loadMoreItem);
            };
        }
        else if (character == "Show All" && account != "Show All") {
            var charList = [];
            $("#characterSelect").find("option").each(function (index) {
                charList.push(this.innerText);
            });
            charListid = 1;
            ended = false;
            window.loadMoreItem = function () {
                if (charListid == charList.length) {
                    if (!ended) {
                        $("#itemsList").append("<div>End Of Items on Account</div>");
                        ended = true;
                    }
                    return;
                }
                var char = charList[charListid];
                charListid = charListid + 1;
                doQuery($("#accountSelect").val(), char, window.loadMoreItem);
            };
        }
        else doQuery($("#accountSelect").val(), character);
    }

    function pupulateAccountCharSelect(realm, core, type, ladder) {
        API.emit("accounts", realm, function (err, account) {
            if (err) console.log(err);
            listOfAccounts = {};

            for (var q in account) {
                var res = account[q].split("\\");

                if (!res || res.length < 3) {
                    continue;
                }

                if (!listOfAccounts[res[1]]) {
                    listOfAccounts[res[1]] = [];
                }

                var charkey = res[2].split(".")[1];

                var checks = {
                    ladder: CurrentGameClass == "Ladder" ? true : false,
                    lod: CurrentGameType == "Expansion" ? true : false,
                    sc: CurrentGameMode == "Softcore" ? true : false
                }

                var charCheck = {
                    ladder: charkey[2] == "l" ? true : false,
                    lod: charkey[1] == "e" ? true : false,
                    sc: charkey[0] == "s" ? true : false
                }

                if ((charCheck.ladder == checks.ladder) && (charCheck.lod == checks.lod) && (charCheck.sc == checks.sc)) 
                    listOfAccounts[res[1]].push(res[2]);
            }

            $("#characterSelect").html("");
            $("#accountSelect").html("");
            var csoption = $("<option/>");
            csoption.text("Show All");
            $("#characterSelect").append(csoption);
            $("#accountSelect").append("");
            var asoption = $("<option/>");
            asoption.text("Show All");
            $("#accountSelect").append(asoption);
            for (var i in listOfAccounts) {
                asoption = $("<option/>");
                asoption.text(i);
                $("#accountSelect").append(asoption);
            }
            refreshList();
        });
    }

    function addMuleForLogging(realm, account, password, character) {
        API.emit("addMule", realm, account, password, character)
    }

    var add_row_index = 1;

    function start(loggedin) {
        if (loggedin) {
            $(".logged-in-out").fadeToggle("hide");
        }

        $("#accountSelect").change(function () {
            $("#characterSelect").html("");
            var $thisAccount = $(this).val();
            var csoption = $("<option/>");
            csoption.text("Show All");
            $("#characterSelect").append(csoption);
            for (var j in listOfAccounts[$thisAccount]) {
                csoption = $("<option/>");
                csoption.text(listOfAccounts[$thisAccount][j]);
                $("#characterSelect").append(csoption);
            }
            refreshList();
        });

        $("#searchItem").change(function () {
            refreshList();
        });

        $("#characterSelect").change(function () {
            refreshList();
        });

        CurrentRealm = window.localStorage.getItem("CurrentRealm");
        if (!CurrentRealm) {
            window.localStorage.setItem("CurrentRealm", "USEast");
            CurrentRealm = window.localStorage.getItem("CurrentRealm");
        }
        CurrentGameType = window.localStorage.getItem("CurrentGameType");
        if (!CurrentGameType) {
            window.localStorage.setItem("CurrentGameType", "Expansion");
            CurrentGameType = window.localStorage.getItem("CurrentGameType");
        }
        CurrentGameMode = window.localStorage.getItem("CurrentGameMode");
        if (!CurrentGameMode) {
            window.localStorage.setItem("CurrentGameMode", "Softcore");
            CurrentGameMode = window.localStorage.getItem("CurrentGameMode");
        }
        CurrentGameClass = window.localStorage.getItem("CurrentGameClass");
        if (!CurrentGameClass) {
            window.localStorage.setItem("CurrentGameClass", "Ladder");
            CurrentGameClass = window.localStorage.getItem("CurrentGameClass");
        }
        var clickedClass = "btn-success";
        //set button state
        $("#gameRealm").find(".gameRealm-" + CurrentRealm).attr("selected", "selected")
        $(".gameRealm-" + CurrentRealm).addClass(clickedClass);
        $(".gameType-" + CurrentGameType).addClass(clickedClass);
        $(".gameMode-" + CurrentGameMode).addClass(clickedClass);
        $(".gameClass-" + CurrentGameClass).addClass(clickedClass);

        $("#gameRealm").change(function () {
            CurrentRealm = $(this).find("option:selected").text().trim();
            window.localStorage.setItem("CurrentRealm", CurrentRealm);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });

        $(".gameType").click(function () {
            if (CurrentGameType == $(this).text().trim()) {
                return;
            }

            $(".gameType").removeClass(clickedClass);
            $(this).addClass(clickedClass);
            CurrentGameType = $(this).text().trim();
            window.localStorage.setItem("CurrentGameType", CurrentGameType);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });

        $(".gameMode").click(function () {
            if (CurrentGameMode == $(this).text().trim()) {
                return;
            }
            
            $(".gameMode").removeClass(clickedClass);
            $(this).addClass(clickedClass);
            CurrentGameMode = $(this).text().trim();
            window.localStorage.setItem("CurrentGameMode", CurrentGameMode);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });

        $(".gameClass").click(function () {
            if (CurrentGameClass == $(this).text().trim()) {
                return;
            }

            $(".gameClass").removeClass(clickedClass);
            $(this).addClass(clickedClass);
            CurrentGameClass = $(this).text().trim().replace(' ', '');
            window.localStorage.setItem("CurrentGameClass", CurrentGameClass);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });
        pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);


        $(function () {
            setInterval(function () {
                var pos;

                var pageTopToDivBottom = $("#loadMore").offset().top + $("#loadMore")[0].scrollHeight;
                var scrolledPlusViewable = $(window).scrollTop() + $(window).height();

                if ($(window).scrollTop() > pageTopToDivBottom)
                    pos = "up";
                else if (scrolledPlusViewable < $("#loadMore").offset().top)
                    pos = "down";
                else
                    pos = "see";

                if (pos == "see") {
                    if (window.loadMoreItem) window.loadMoreItem();
                }
            }, 500);
        })

        $("#log_accounts").click(function() {
            var apipass = document.getElementById("log_accounts_api").value;

            if (!apipass || apipass.length < 1) {
                return;
            }

            for (var i = 0; i < add_row_index; i++) {
                var realm = document.getElementsByName('realm' + i)[0].value.toLowerCase();
                var acc = document.getElementsByName('acc' + i)[0].value.toLowerCase();
                var pass = document.getElementsByName('pass' + i)[0].value.toLowerCase();
                var chars = document.getElementsByName('chars' + i)[0].value.toLowerCase();

                if (realm.length == 0 || acc.length == 0 || pass.length == 0) {
                    continue;
                }

                if (chars.length == 0) {
                    chars = [""];
                } else {
                    chars = document.getElementsByName('chars' + i)[0].value.toLowerCase().split(/[\s,;: ]+/);
                }

                var hash = API.md5(realm + acc).toString();

                API.emit("put", "secure", hash + ".txt", pass, apipass, function (err) {});

                var GameInfo = {
                    hash: hash,
                    profile: cookie.data.username,
                    action: "doMule",
                    data: JSON.stringify({realm: realm, account: acc, chars: chars})
                }

                API.emit("gameaction", GameInfo, function (err) {});

                document.getElementsByName('acc' + i)[0].value = "";
                document.getElementsByName('pass' + i)[0].value = "";
                document.getElementsByName('chars' + i)[0].value = "";
            }

            $('#addAccountsModal').modal('hide');
        });

        $(".queueDrops-btn").click(function () {
            var gamename = $("#gamename").val();
            var gamepass = $("#gamepass").val();
            var drops = {};
            
            if(!gamename || gamename == ""){
                alert("GameName Required!");
              return;   
            }

            $(".selected").each(function (i, v) {
                var $item = $(v);
                var item = $item.data("itemData");
                delete item.image;
                delete item.description;

                $item.remove();

                var hash = API.md5(item.realm+item.account).toString();

                if (!drops[hash]) {
                    drops[hash] = [];
                }

                drops[hash].push(item);
            })

            for (var d in drops) {
                if (drops.hasOwnProperty(d)) {
                    var GameInfo = {
                        hash: d,
                        profile: cookie.data.username,
                        action: "doDrop",
                        data: JSON.stringify({gameName: gamename, gamePass: gamepass, items: drops[d]})
                    }

                    API.emit("gameaction", GameInfo, function (err) {})
                }
            }
        })

        $(".logout-btn").click(function () {
            $(".queueDrops-btn").off("click");
            $(".logout-btn").off("click");
            $(".addMule-btn").off("click");
            $(".gameType").off("click");
            $(".gameMode").off("click");
            $(".gameClass").off("click");
            $(".logged-in-out").fadeToggle("hide");
            login("public", "public", function(loggedin){});
        })

    }

    $(".add-acc-btn").click(function () {
        $("#addAccountsModal").modal('show');
        while (add_row_index > 5) {
            $("#addr"+(add_row_index-1)).html('');
            add_row_index--;
        }
    });

    $("#add_row").click(function(){
        $('#addr'+add_row_index).html("<td data-label='Realm' class='ld-modal-col0'><select class='ld-select-add' name='realm" + add_row_index + "'><option>USEast</option><option>USWest</option><option>Europe</option><option>Asia</option></select></td><td data-label='Account' class='ld-modal-col1'><input class='ld-input-add' type='text' name='acc" + add_row_index + "' placeholder='Account' /></td><td data-label='Password' class='ld-modal-col2'><input class='ld-input-add' type='text' name='pass" + add_row_index + "' placeholder='Password'/></td><td data-label='Character(s)' class='ld-modal-col3'><input class='ld-input-add' type='text' name='chars" + add_row_index + "' placeholder='a, b, c or empty'/></td>");
        $('#tab_logic').append('<tr id="addr'+(add_row_index+1)+'"></tr>');
        add_row_index++; 
    });

    $(".ld-notify-card").click(function () {
        if ($(this).hasClass("always-there")) {
            return;
        }

        $(this).remove();
    })

    $("#login-ok-btn").click(function () {
        var username = String($("#ld-login-user").val());
        var password = String($("#ld-login-pw").val());

        if (username.length > 0 && password.length > 0) {
            login(username, password, function (loggedin) {
                start(loggedin);
            });
        }
    })

    initialize();
    showNotificaiton("Welcome to Lime Drop!", true);
});

const scriptName="Admin_Script.js";

/*
DotoriBot - Admin Script
Copyright Goromong 2018, All rights reserved.

<작동 방식>
1. 첫번째로 배열에 관리자 이름을 넣고 저장하면 폴더에 관리자 이름이 저장됨.
2. 그 다음부터는 폴더에서 관리자 이름을 불러온다.
3. 최고 관리자는 삭제에서 무조건 방어됩니다.
4. 관리자 초기화는 관리자 권한이 없어도 진행 가능합니다. (인증 코드 필요)
5. 관리자 추가한 다음 인증을 무조건 해야 다른 관리자 관리 명령어 사용 가능.
6. 관리자 명령어는 첫번째로 관리자 데이터에 명령어를 입력한 사람의 이름이 있는지 확인한 다음 두번째로 프로필 사진 데이터의 해시코드를 비교해서 인증을 진행한다.

<가이드라인>

- 개발자의 허락 없이 소스 코드 무단 배포 금지, 자기가 만든 것마냥 행세해도 죽창 날립니다. 그런 짓 하지마세요
- 소스 사용시 원작자를 밝혀주세요.
  ex) 이 봇은 Goromong의 관리자 관리 소스를 사용하였습니다.

<라이선스>

이 소스에는 LGPL 3.0이 적용되어있습니다.

one line to give the library's name and an idea of what it does.
Copyright Goromong 2018 All rights reserved.

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/

var Permit_Code = [];
var Admin = ["(관리자 이름)"] //(관리자 이름)에 자신의 톡 이름을 넣고 한번 저장한다음 아래에 있는 소스 한줄에 있는 //를 제거해주세요
//var Admin=eval(DataBase.getDataBase("봇_관리자")) // 관리자 목록을 불러오는 폴더 이름 : 봇_관리자

function isAdmin(name) {
    return Admin.indexOf(name) != -1;
}
function getWifiSpeed() {
    var wifiManager = Api.getContext().getSystemService(android.content.Context.WIFI_SERVICE);
    var wifiInfo = wifiManager.getConnectionInfo();
    if (wifiInfo != null) {
        return wifiInfo.getLinkSpeed();
    }
}
function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){

let AlarmManager = Api.getContext().getSystemService(android.content.Context.ALARM_SERVICE);
let mm = (AlarmManager.ELAPSED_REALTIME_WAKEUP, android.os.SystemClock.elapsedRealtime());
let sec = (mm/1000) % 60;
let min = (mm/(1000*60)) % 60;
let hr = (mm/(1000*60*60)) % 24;
    var isCharging = Device.isCharging()?"밥 먹는중!":"배터리 사용중";
    var access_code = Math.floor(Math.random()*100000);
    msg = msg.trim();
    if(msg.indexOf("=관리자 추가") == 0) {
        if(isAdmin(sender)) {
            if(DataBase.getDataBase("봇_관리자/" + sender) == java.lang.String(ImageDB.getProfileImage()).hashCode()){
                Admin.push(msg.substr (8));
                Api.replyRoom(room, "🛠️System :: " + msg.substr (8) + "님이 관리자로 추가되었습니다!\n정상적인 명령어 사용을 위해 =관리자 인증 명령어를 사용해주세요!");
                Api.replyRoom("(방 이름)", "Dotori Log : " + msg.substr (8) + "의 관리자 권한이 생성됨."); //로그를 남길 오픈채팅 방이름을 지정해주세요.
            } else if(DataBase.getDataBase("봇_관리자/" + sender) != java.lang.String(ImageDB.getProfileImage()).hashCode()) {
                Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보가 올바르지 않아 등록 취소되었습니다.\n=관리자 인증 명령어로 인증 정보를 변경해주세요!");
            }
        } else{
            Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
        }
    }
    if(msg.indexOf("=관리자 인증") == 0) {
        if(isAdmin(sender)) {
            Api.replyRoom("(방 이름)", "Dotori Log : 데이터 변경 인증 코드가 발급되었습니다! 인증 코드 : " + access_code); //로그를 남길 오픈채팅 방이름을 지정해주세요.
            Api.replyRoom(room, "🛠️System :: 봇 개발자님의 폰에 인증 코드가 전송되었습니다.\n관리자분에게 문의 후 =확인 (인증번호) 명령어를 통해 인증을 완료해주세요!");
            Permit_Code.push(access_code);
        } else{
        Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
        }
    }
    if(msg.indexOf("=확인")==0 && isAdmin(sender)) {
        var access = msg.substr (4);
        if(Permit_Code == access) {
            Api.replyRoom(room, "🛠️System :: 인증 확인 되었습니다!\n" + sender + "님의 데이터 반영중...");
            DataBase.removeDataBase("봇_관리자/" + sender);
            DataBase.setDataBase("봇_관리자/" + sender,java.lang.String(ImageDB.getProfileImage()).hashCode());
            Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보 변경됨!");
            Permit_Code = [];
        } else if(Permit_Code != access){
            Api.replyRoom(room, "🛠️System :: 인증코드가 일치하지 않습니다!\n확인 후 다시 인증을 요청해주세요.");
            Permit_Code = [];
        }
    }
    if(msg.indexOf("=관리자 삭제") == 0) {
        if(isAdmin(sender)) {
            if(DataBase.getDataBase("봇_관리자/" + sender) == java.lang.String(ImageDB.getProfileImage()).hashCode()){
                name = msg.substr (8);
                if(Admin.indexOf(name) == -1) return Api.replyRoom(room, "🛠️System :: " + name + "님은 관리자 데이터에 존재하지 않습니다!");
                if(name == "(관리자 이름)" || name == "(관리자 이름)" || name == "(관리자 이름)") return Api.replyRoom(room, "🛠️System :: " + name + "님은 최고 관리자이므로 삭제할 수 없습니다."); //관리자 하나로 지정하셔도 상관 없습니다.
                Admin.splice(Admin.indexOf(name), 1);
                DataBase.removeDataBase("봇_관리자/"+name);
                Api.replyRoom(room, "🛠️System :: " + name + "님의 관리자 권한이 삭제되었습니다.");
                Api.replyRoom("(방 이름)", "Dotori Log : " + name + "의 관리자 권한이 소멸됨."); //로그를 남길 오픈채팅 방이름을 지정해주세요.
            } else if(DataBase.getDataBase("봇_관리자/" + sender) != java.lang.String(ImageDB.getProfileImage()).hashCode()) {
                Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보가 올바르지 않아 삭제 취소되었습니다.\n=관리자 인증 명령어로 인증 정보를 변경해주세요!");
            }
        } else{
            Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
        }
    }
    if(msg.indexOf("=관리자 목록")==0) {
        Api.replyRoom(room, Admin);
    }
    try{
        if(msg == "=관리자 저장") {
            DataBase.setDataBase("봇_관리자", Admin.toSource());
            Api.replyRoom(room, "🛠️System :: 성공적으로 관리자 데이터를 저장했습니다!");
        }
    } catch(e){
        Api.replyRoom(room, "🛠️System :: 저장 도중 치명적인 오류가 발생하여 관리자방에 로그를 전송합니다.");
        Api.replyRoom("(방 이름)", "스크립트 에러\n에러내용 : "+e+"\n에러난 코드줄 : "+e.lineNumber) //로그를 남길 오픈채팅 방이름을 지정해주세요.
    }
    try{
        if(msg == "=관리자 불러오기") {
            Admin = eval(DataBase.getDataBase("봇_관리자"));
            Api.replyRoom(room, "🛠️System :: 성공적으로 관리자 데이터를 로드했습니다!");
        }
    } catch(e){
        Api.replyRoom(room, "🛠️System :: 불러오기 도중 치명적인 오류가 발생하여 관리자방에 로그를 전송합니다.");
        Api.replyRoom("(방 이름)", "스크립트 에러\n에러내용 : "+e+"\n에러난 코드줄 : "+e.lineNumber) //로그를 남길 오픈채팅 방이름을 지정해주세요.
    }
    try{
        if(msg == "=관리자 초기화") {
            Api.replyRoom("(방 이름)", "Dotori Log : 초기화 인증 코드가 발급되었습니다! 인증 코드 : " + access_code); //로그를 남길 오픈채팅 방이름을 지정해주세요.
            Api.replyRoom(room, "🛠️System :: 봇 개발자님의 폰에 인증 코드가 전송되었습니다.\n관리자분에게 문의 후 =초기화 확인 (인증번호) 명령어를 통해 인증을 완료해주세요!");
            Permit_Code.push(access_code);
        }
        if(msg.indexOf("=초기화 확인")==0) {
            var access = msg.substr (8);
            if(Permit_Code == access) {
                Api.replyRoom(room, "🛠️System :: 인증 확인 되었습니다!\n관리자 데이터 초기화를 진행합니다.");
                DataBase.removeDataBase("봇_관리자");
                Admin = ["도토리"];
                DataBase.setDataBase("봇_관리자", Admin.toSource());
                Api.replyRoom(room, "🛠️System :: 성공적으로 관리자 데이터를 초기화했습니다!\n관리자 데이터 저장을 위해 인증을 다시 진행해주세요!");
                Permit_Code = [];
            } else if(Permit_Code != access){
                Api.replyRoom(room, "🛠️System :: 인증코드가 일치하지 않습니다!\n확인 후 다시 초기화를 진행해주세요.");
                Permit_Code = [];
            }
        }
    } catch(e){
        Api.replyRoom(room, "🛠️System :: 초기화 도중 치명적인 오류가 발생하여 관리자방에 로그를 전송합니다.");
        Api.replyRoom("(방 이름)", "스크립트 에러\n에러내용 : "+e+"\n에러난 코드줄 : "+e.lineNumber); //로그를 남길 오픈채팅 방이름을 지정해주세요.
    }
    if(msg.indexOf ("=봇 정보") == 0) {
        if(isAdmin(sender)) {
            if(DataBase.getDataBase("봇_관리자/" + sender) == java.lang.String(ImageDB.getProfileImage()).hashCode()){
                replier.reply("====================\nBot Name : (봇 이름)\nBot Version : (봇 버전)\nBot Battery Percent : " + Device.getBatteryLevel() + "%\nBot Battery Status : " + isCharging + "\nBot Network Speed : " + getWifiSpeed() + "Mb/s\nBot Running Time : "+Math.floor(hr) + "시간 " + Math.floor(min) +"분 "+Math.floor(sec)+"초\n====================\n★ 이 봇은 Goromong의 관리자 관리 소스를 사용하였습니다.");
            } else if(DataBase.getDataBase("봇_관리자/" + sender) != java.lang.String(ImageDB.getProfileImage()).hashCode()) {
                Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보가 올바르지 않아 정보가 비공개되었습니다.\n=관리자 인증 명령어로 인증 정보를 변경해주세요!");
            }
        } else{
            Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
        }
    }
    if(msg.indexOf ("=봇 시작") == 0) {
        if(isAdmin(sender)) {
            if(Api.isOn("Main.js") == true) return Api.replyRoom(room, "🛠️System :: 이미 봇이 켜져있습니다!");
            if(DataBase.getDataBase("봇_관리자/" + sender) == java.lang.String(ImageDB.getProfileImage()).hashCode()){
                replier.reply ("🛠️System :: 도토리 봇 시작 준비중.........");
                Api.compile("Main.js");
                //Api.compile("Reply_Glass.js");
                Api.on("Main.js");
                //Api.on("Reply_Glass.js");
                replier.reply ("🛠️System :: 도토리 봇 가동 완료");
            } else if(DataBase.getDataBase("봇_관리자/" + sender) != java.lang.String(ImageDB.getProfileImage()).hashCode()) {
                Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보가 올바르지 않아 시작 취소되었습니다.\n=관리자 인증 명령어로 인증 정보를 변경해주세요!");
            }
        } else{
            Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
        }
    }
    if(msg.indexOf ("=봇 종료") == 0) {
        if(isAdmin(sender)) {
            if(Api.isOn("Main.js") == false) return Api.replyRoom(room, "🛠️System :: 이미 봇이 꺼져있습니다!");
            if(DataBase.getDataBase("봇_관리자/" + sender) == java.lang.String(ImageDB.getProfileImage()).hashCode()){
                replier.reply ("🛠️System :: 도토리 봇을 종료합니다.");
                Api.unload("Main.js");
                //Api.unload("Reply_Glass.js");
                Api.off("Main.js");
                //Api.off("Reply_Glass.js");
            } else if(DataBase.getDataBase("봇_관리자/" + sender) != java.lang.String(ImageDB.getProfileImage()).hashCode()) {
                Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보가 올바르지 않아 종료 취소되었습니다.\n=관리자 인증 명령어로 인증 정보를 변경해주세요!");
            }
        } else{
            Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
        }
    }
    if(msg.indexOf ("=봇 재부팅") == 0) {
        if(isAdmin(sender)) {
            if(DataBase.getDataBase("봇_관리자/" + sender) == java.lang.String(ImageDB.getProfileImage()).hashCode()){
                replier.reply ("🛠️System :: 모든 기능을 끄고 도토리 봇을 재부팅합니다.");
                Api.unload("Main.js");
                //Api.unload("Reply_Glass.js");
                java.lang.Thread.sleep(1*1000);
                Api.off("Main.js");
                //Api.off("Reply_Glass.js");
                replier.reply("🛠️System :: 도토리 봇 재부팅중........")
                Api.compile("Main.js");
                //Api.compile("Reply_Glass.js");
                java.lang.Thread.sleep(1*1000);
                Api.on("Main.js");
                //Api.on("Reply_Glass.js");
                replier.reply("🛠️System :: 도토리 봇 재부팅 성공!")
            } else if(DataBase.getDataBase("봇_관리자/" + sender) != java.lang.String(ImageDB.getProfileImage()).hashCode()) {
                Api.replyRoom(room, "🛠️System :: " + sender + "님의 인증 정보가 올바르지 않아 재부팅 취소되었습니다.\n=관리자 인증 명령어로 인증 정보를 변경해주세요!");
            }
            } else{
                Api.replyRoom(room, "🛠️System :: " + sender + "님은 관리자 권한이 없습니다!");
            }
    }

    if(msg.indexOf("=관리자 호출 ")==0){
        var noti_alert = msg.substring(8);
        replier.reply("관리자를 호출하였습니다!")
        Api.replyRoom("(방 이름)", "Dotori Alert Sender : " + sender + " // 사유 : " + msg.substring(8)); //로그를 남길 오픈채팅 방이름을 지정해주세요.
    }
}
function onStartCompile(){
    DataBase.setDataBase("봇_관리자", Admin.toSource());
    Api.replyRoom("(방 이름)", "Dotori Log : 자동으로 관리자 배열이 저장됨."); //로그를 남길 오픈채팅 방이름을 지정해주세요.
}
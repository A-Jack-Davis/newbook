/**
 * dateTimeStamp是评论的发送时间   2020-01-12 20:10:15 这样的形式
 * @param dateTimeStamp
 * @returns {string}
 */
export default function timeAgo(dateTimeStamp: string) {
    let result = "";
    let minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();   //获取当前时间毫秒


    let timestamp = new Date(dateTimeStamp).getTime();

    let diffValue = now - timestamp;//时间差

    if (diffValue < 0) {
        return result;
    }

    let minC = Math.floor(diffValue / minute);  //计算时间差的分，时，天，周，月
    let hourC = Math.floor(diffValue / hour);
    let dayC = Math.floor(diffValue / day);
    let weekC = Math.floor(diffValue / week);
    let monthC = Math.floor(diffValue / month);

    if (monthC >= 1 && monthC <= 3) {
        result = " " + monthC + "月前"
    } else if (weekC >= 1 && weekC <= 3) {
        result = " " + weekC + "周前"
    } else if (dayC >= 1 && dayC <= 6) {
        result = " " + dayC + "天前"
    } else if (hourC >= 1 && hourC <= 23) {
        result = " " + hourC + "小时前"
    } else if (minC >= 1 && minC <= 59) {
        result = " " + minC + "分钟前"
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚"
    } else {
        let datetime = new Date(dateTimeStamp);
        let Nyear = datetime.getFullYear();
        let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        let Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        let Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        let Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result;
}

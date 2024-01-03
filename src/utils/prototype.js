const prototype = {
  /**
   * 时间戳返回多久以前（刚刚/几秒前/几分钟前/几小时前/几天前/几周前/几个月前/几年前）。示例：$fn.$timeDiff(时间戳)
   * @timeStamp {number|string} 时间戳，单位为毫秒
   */
  $timeDiff: (timeStamp) => {
    //将字符串转换成时间格式
    let now = new Date().getTime(),
      oldTime = Number(timeStamp),
      difference = now - oldTime,
      result = '',
      second = 1000,
      minute = 1000 * 60,
      hour = minute * 60,
      day = hour * 24,
      halfamonth = day * 15,
      month = day * 30,
      year = month * 12,
      _year = difference / year,
      _month = difference / month,
      _week = difference / (7 * day),
      _day = difference / day,
      _hour = difference / hour,
      _min = difference / minute,
      _second = difference / second;

    if (_year >= 1) {
      result = Math.floor(_year) + '年前';
    } else if (_month >= 1) {
      result = Math.floor(_month) + '个月前';
    } else if (_week >= 1) {
      result = Math.floor(_week) + '周前';
    } else if (_day >= 1) {
      result = Math.floor(_day) + '天前';
    } else if (_hour >= 1) {
      result = Math.floor(_hour) + '小时前';
    } else if (_min >= 1) {
      result = Math.floor(_min) + '分钟前';
    } else if (_second > 5000) {
      result = Math.floor(_second) + '秒前';
    } else {
      result = '刚刚';
    }
    return result;
  },
  /**
   * 时间戳返回年月日、月、日。示例：$fn.$timeFormat(时间戳)
   * @data {Number|String} 时间戳，单位为毫秒
   * @format {String} 时间格式，YYYY-MM-DD [完整格式：YYYY-MM-DD HH:mm:ss，YYYY-MM-DD]。HH是24小时制，hh为12小时制。也可以 YYYY年MM月DD日
   */
  $timeFormat: (data, format) => {
    format = format || 'YYYY-MM-DD';
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date = new Date(Number(data));
    const o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S+': date.getMilliseconds(),
      'W+': week[date.getDay()],
    };
    if (/(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
        );
      }
    }
    return format;
  },
  /**
   * 生成七位数纯Id
   * @see https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript?page=1&tab=votes#tab-top
   */
  $makeid: () => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
};

export default prototype;

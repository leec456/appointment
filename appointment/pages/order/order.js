let util = require('../../utils/util.js');

Page({
    data: {
        flag: [{
                tab: 0,
                isChoosed: false,
                content: '星期一',
                day: ''
            },
            {
                tab: 1,
                isChoosed: false,
                content: '星期二',
                day: ''
            },
            {
                tab: 2,
                isChoosed: false,
                content: '星期三',
                day: ''
            },
            {
                tab: 3,
                isChoosed: false,
                content: '星期四',
                day: ''
            },
            {
                tab: 4,
                isChoosed: false,
                content: '星期五',
                day: ''
            },
            {
                tab: 5,
                isChoosed: false,
                content: '星期六',
                day: ''
            },
            {
                tab: 6,
                isChoosed: false,
                content: '星期日',
                day: ''
            },
        ],
        itemArr: [{
                id: 0,
                seat: 0,
                time: '8:00-9:00'
            }, {
                id: 0,
                seat: 3,
                time: '9:00-10:00'
            }, {
                id: 0,
                seat: 2,
                time: '10:00-11:00'
            },
            {
                id: 1,
                seat: 0,
                time: '11:00-12:00'
            }, {
                id: 1,
                seat: 2,
                time: '13:00-14:00'
            }, {
                id: 1,
                seat: 0,
                time: '14:00-15:00'
            },
            {
                id: 2,
                seat: 3,
                time: '15:00-16:00'
            }, {
                id: 2,
                seat: 3,
                time: '16:00-17:00'
            }, {
                id: 2,
                seat: 1,
                time: '17:00-18:00'
            },
        ],
        id: [{
            id: 0
        }, {
            id: 1
        }, {
            id: 2
        }],
        array: [1, 2, 3],
        rubber: ['默认', '黄荣', '李聪'],
        index: 0,
        indexRubber: 0,
        leapYear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        norYear: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        day: '',
        seat: '',
    },

    onLoad: function(e) {
        let flag = this.data.flag;

        let date = new Date()

        //1 2 3 4 5 6 0
        let week = (date.getDay() + 6) % 7;

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let monthLength = 0;
        let leapFlag = false;
        if (year % 400 == 0 || (year % 400 != 0 && year % 4 == 0)) {
            leapFlag = true;
            monthLength = this.data.leapYear[month - 1];
        } else {
            monthLength = this.data.norYear[month - 1];
        }

        let i = week;
        let j = 0;
        if (month < 10) {
            flag[i].day = year + '-0' + month;
        } else {
            flag[i].day = year + '-' + month;
        }

        if (day < 10) {
            flag[i].day += '-0' + day;
        } else {
            flag[i].day += '-' + day;
        }

        for (; j < 6; j++, i++) {
            if (day === monthLength) {
                day = 1;
                if (month < 12) {
                    month = 1;
                    year += 1;
                } else {
                    month += 1;
                }
            } else {
                day += 1;
            }

            if (month < 10) {
                flag[(i + 1) % 7].day = year + '-0' + month;
            } else {
                flag[(i + 1) % 7].day = year + '-' + month;
            }

            if (day < 10) {
                flag[(i + 1) % 7].day += '-0' + day;
            } else {
                flag[(i + 1) % 7].day += '-' + day;
            }
        }

        day = flag[week].day;
        flag[week].isChoosed = true;
        let temp;
        for (i = 6; i >= week; i--) {
            temp = flag.pop();
            flag.unshift(temp);
        }

        this.setData({
            day: day,
            flag: flag,
        })
    },

    onShow: function (e) {
        let seatInfo = wx.getStorageSync('seatInfo') || [0, 3, 2, 0, 2, 0, 3, 3, 1];
        let itemArr = this.data.itemArr;
        let k = 0;
        for (k = 0; k < 9; k++) {
            itemArr[k].seat = seatInfo[k];
        }

        let seat = wx.getStorageSync('seat') || '1';

        this.setData({
            seat: seat,
            itemArr: itemArr
        }),
        wx.setStorageSync('seatInfo', seatInfo);
    },

    detail: function (e) {
        let index = e.currentTarget.dataset.index;
        let temp = this.data.itemArr[index];
        try {
            wx.setStorageSync('seatIndex', index)
            wx.setStorageSync('time', temp.time);
            wx.setStorageSync('date', this.data.day);
        } catch (e) {
            console.log(e);
        }
        if (temp.seat >= this.data.seat) {
            wx.navigateTo({
                url: '../detail/detail'
            });
        }
    },

    week: function (e) {
        let idx = e.currentTarget.dataset.index;
        let temp = this.data.flag;
        let i = 0;
        let day = temp[idx].day;
        for (; i < 7; i++) {
            temp[i].isChoosed = false;
        }
        temp[idx].isChoosed = true;

        this.setData({
            flag: temp,
            day: day
        })
    },

    title: function (e) {
        wx.navigateTo({
            url: '../jsy/jsy'
        });
    },

    bindPickerChange: function (e) {
        let temp = e.detail.value || wx.getStorageSync('seat');
        let seatTemp = this.data.array[temp];
        this.setData({
            index: temp,
            seat: seatTemp
        });
        wx.setStorageSync('seat', seatTemp);
    },

    bindPickerChangeRubber: function (e) {
        let indexRubber = e.detail.value || wx.getStorageSync('indexRubber');
        // console.log(temp)
        // let rubber = this.data.rubber[temp];
        this.setData({
            indexRubber: indexRubber,
            // seat: seatTemp
        });
        wx.setStorageSync('indexRubber', indexRubber);
    },
})
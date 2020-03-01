module.exports = [
    {
        title: '👥 Ghép đôi',
        type: 'nested',
        call_to_actions: [
            {
                title: 'Tìm gia sư',
                type: 'postback',
                payload: 'MATCH_STUDENT',
            },
            {
                title: 'Tìm học sinh',
                type: 'postback',
                payload: 'MATCH_TUTOR',
            },
            {
                title: 'Kết thúc / Dừng tìm kiếm',
                type: 'postback',
                payload: 'END_CONVER',
            },
        ]
    },
    {
        title: '🎓 Lớp học',
        type: 'nested',
        call_to_actions: [
            {
                title: 'Tạo lớp học',
                type: 'postback',
                payload: 'CREATE_CLASS',
            },
            {
                title: 'Vào lớp học',
                type: 'postback',
                payload: 'JOIN_CLASS',
            },
            {
                title: 'Danh sách lớp học',
                type: 'postback',
                payload: 'LIST_CLASS',
            },
        ]
    },
    {
        title: '⚙ Tính năng khác',
        type: 'nested',
        call_to_actions: [
            {
                title: 'Hướng dẫn sử dụng',
                type: 'postback',
                payload: 'HELP',
            },
            {
                title: 'Tài khoản của tôi',
                type: 'postback',
                payload: 'USER_INFO',
            },
            {
                title: 'Cài đặt tài khoản',
                type: 'postback',
                payload: 'SETTINGS',
            },
            {
                title: 'Góp ý / báo lỗi',
                type: 'web_url',
                url: 'https://m.me/100007015541619',
            },
        ]
    },
]

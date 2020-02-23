

module.exports = async (payload, chat) => {
    await chat.say('Chào mừng bạn đến với TutorBot, đây là nền tảng giúp các bạn kết nối với nhau và giúp đỡ nhau trong học tập.')
    await chat.say({
        text: 'Hiện tại ứng dụng mới được phát triển nên không tránh khỏi những sai sót, nếu bạn có gặp bất kì trục trặc nào thì hãy liên hệ đến anh đẹp trai http://fb.com/100007015541619 này nhé =))',
        buttons: [
            { type: 'postback', title: 'Ghép đôi ngay', payload: 'MATCH' },
            { type: 'postback', title: 'Chỉnh sửa thông tin', payload: 'SETTINGS' },
        ]
    })
}
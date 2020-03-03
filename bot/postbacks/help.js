

module.exports = (payload, chat) => {
    let matchFeat = '👥 Ghép đôi: Bạn có thể lựa chọn làm gia sư hoặc học sinh, sau đó bạn sẽ được ghép đôi với học sinh (gia sư) khác theo lứa tuổi và môn học phù hợp mà bạn cung cấp.'
    let classFeat = '🎓 Lớp học: Bạn có thể tạo ra 1 lớp học tối đa 20 thành viên (công khai hoặc riêng tư), mỗi lớp học tạo ra sẽ được cung cấp 1 mã lớp học, bất kì ai có mã sẽ được tham gia vào lớp học của bạn, nếu lớp học của bạn "công khai" thì mọi người sử dụng TutorBot đều có thể thấy và tham gia lớp học.'
    chat.say({
        text: `Hiện tại TutorBot đang hỗ trợ 2 chức năng chính (Ghép đôi và Lớp học)\n\n${matchFeat}\n\n${classFeat}`,
        buttons: [
            { type: 'web_url', title: 'Xem video hướng dẫn', url: 'https://www.facebook.com/tutorbot.vn/videos/676003296541277' },
            { type: 'web_url', title: 'Góp ý / báo lỗi', url: 'https://m.me/100007015541619' }
        ]
    })
}
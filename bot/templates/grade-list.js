module.exports = list => {
	return Object.entries(list).map(each => {
		return {
			title: each[1].title,
			image_url: each[1].imgUrl,
			buttons: [
				{
                    title: 'Chọn',
					type: 'postback',
					payload: `${each[0]}`
				}
            ]
		}
	})
}

const mySwiper = new Swiper('.swiper-container', {
    loop: true,

    // Navigation arrows
    navigation: {
        nextEl: '.slider-button-next',
        prevEl: '.slider-button-prev',
    },
})

//cart

const buttonCart = document.querySelector('.button-cart')
const modalCart = document.querySelector('#modal-cart')
const more = document.querySelector('.more')
const navigationLinks = document.querySelectorAll('.navigation-link')
const loghGoodsList = document.querySelector('.long-goods-list')
const cartTableGoods = document.querySelector('.cart-table__goods')
const cardTableTotal = document.querySelector('.card-table__total')

const cart = {
    cartGoods: [
        { id: '099', name: 'Часы Dior', price: 999, count: 2 },
        { id: '090', name: 'Кеды Nike', price: 99, count: 3 },
    ],
    renderCart() {
        cartTableGoods.textContent = ''
    },
    deleteGood(id) {},
    minusGood(id) {},
    plusGood(id) {},
    addCartGoods(id) {},
}

cart.renderCart()

const getGoods = async () => {
    const result = await fetch('db/db.json')
    if (!result.ok) {
        throw 'Ошибка ' + result.status
    }
    return await result.json()
}

openModal = () => {
    modalCart.classList.add('show')
}

closeModal = () => {
    modalCart.classList.remove('show')
}

buttonCart.addEventListener('click', openModal)
modalCart.addEventListener('click', e => {
    let target = e.target
    if (target == modalCart || target.classList.contains('modal-close')) {
        closeModal()
    }
})

// scroll smooth
;(function () {
    const scrollLinks = document.querySelectorAll('.scroll-link')

    for (scrollLink of scrollLinks) {
        scrollLink.addEventListener('click', e => {
            e.preventDefault()
            const id = scrollLink.getAttribute('href')
            document.querySelector(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        })
    }
})()

// goods

// fetch('db/db.json')
// 	.then(response => response.json())
// 	.then(data => console.log(data))

const createCard = function ({ label, name, img, description, id, price }) {
    const card = document.createElement('div')
    card.className = 'col-lg-3 col-sm-6'
    card.innerHTML = `
	<div class="goods-card">
		${label ? `<span class="label">${label}</span>` : ''}		
		<img src="db/${img}" alt="image: ${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>
	`
    return card
}

const renderCards = function (data) {
    loghGoodsList.textContent = ''
    const cards = data.map(createCard)
    loghGoodsList.append(...cards)
    document.body.classList.add('show-goods')
}

more.addEventListener('click', e => {
    e.preventDefault()
    getGoods().then(renderCards)
})

const filterCards = (field, value) => {
    getGoods()
        .then(data =>
            field ? data.filter(good => good[field] === value) : data
        )
        .then(renderCards)
}

navigationLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault()
        const field = link.dataset.field
        const value = link.textContent
        filterCards(field, value)
    })
})

const buttonViewAllAccessories = document.querySelector(
    '.button-view-all-accessories'
)
const buttonViewAllClothing = document.querySelector(
    '.button-view-all-clothing'
)

buttonViewAllAccessories.addEventListener('click', e => {
    e.preventDefault()
    filterCards('category', 'Accessories')
})
buttonViewAllClothing.addEventListener('click', e => {
    e.preventDefault()
    filterCards('category', 'Clothing')
})

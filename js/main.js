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

const getGoods = async () => {
    const result = await fetch('db/db.json')
    if (!result.ok) {
        throw 'Ошибка ' + result.status
    }
    return await result.json()
}

const cart = {
    cartGoods: [
        { id: '099', name: 'Часы Dior', price: 999, count: 2 },
        { id: '090', name: 'Кеды Nike', price: 99, count: 3 },
    ],
    renderCart() {
        cartTableGoods.textContent = ''
        this.cartGoods.forEach(({ id, name, price, count }) => {
            const trGood = document.createElement('tr')
            trGood.className = 'cart-item'
            trGood.dataset.id = id
            trGood.innerHTML = `
            <td>${name}</td>
            <td>${price}$</td>
            <td><button class="cart-btn-minus">-</button></td>
            <td>${count}</td>
            <td><button class="cart-btn-plus">+</button></td>
            <td>${price * count}$</td>
            <td><button class="cart-btn-delete">x</button></td>
            `
            cartTableGoods.append(trGood)
        })
        const totalPrice = this.cartGoods.reduce((sum, item) => {
            return sum + item.price * item.count
        }, 0)
        cardTableTotal.textContent = totalPrice
    },
    deleteGood(id) {
        this.cartGoods = this.cartGoods.filter(item => id !== item.id)
        this.renderCart()
    },
    minusGood(id) {
        for (const item of this.cartGoods) {
            if (item.id === id) {
                if (item.count <= 1) {
                    this.deleteGood(id)
                } else {
                    item.count--
                }
                break
            }
        }
        this.renderCart()
    },
    plusGood(id) {
        for (const item of this.cartGoods) {
            if (item.id === id) {
                item.count++
                break
            }
        }
        this.renderCart()
    },
    addCartGoods(id) {
        const goodItem = this.cartGoods.find(item => item.id === id)
        if (goodItem) {
            this.plusGood(id)
        } else {
            getGoods()
                .then(data => data.find(item => item.id === id))
                .then(({ id, name, price }) => {
                    this.cartGoods.push({
                        id,
                        name,
                        price,
                        count: 1,
                    })
                })
        }
    },
}

cart.addCartGoods('001')

cartTableGoods.addEventListener('click', e => {
    const target = e.target
    if (target.tagName === 'BUTTON') {
        const id = target.closest('.cart-item').dataset.id
        if (target.classList.contains('cart-btn-delete')) {
            cart.deleteGood(id)
        }
        if (target.classList.contains('cart-btn-minus')) {
            cart.minusGood(id)
        }
        if (target.classList.contains('cart-btn-plus')) {
            cart.plusGood(id)
        }
    }
})

openModal = () => {
    cart.renderCart()
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

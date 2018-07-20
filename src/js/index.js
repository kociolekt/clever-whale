import documentReady from './utils/document-ready';
import fromHtml from './utils/from-html';
import itemTemplate from '../html/item-template.html';
import groupsTemplate from '../html/groups-template.html';
import coinTemplate from '../html/coin-template.html';

const defaults = {
    maxItems: 10,
    itemInterval: 2000,
    itemIntervalRand: 1000,
    items: ['ball', 'ball2', 'baloon', 'car', 'car2', 'duck', 'eight', 'food', 'smallwhale', 'zero', 'flower'],
    whaleInterval: 5000,
    whaleIntervalRand: 2000,
};

class CleverWhale {
    constructor($context, options) {
        this.$context = $context;
        this.$items = $context.querySelector('.js-items');
        this.$whale = $context.querySelector('.js-whale');
        this.$coinCounter = $context.querySelector('.js-coin-counter');
        this.coins = 0;

        this.settings = Object.assign({}, defaults, options);

        this.groups = null;

        this.init();
    }

    init() {
        this.initItems();
        this.initGroups();
    }

    initItems() {
        this.initRandomItems();
        this.initClickItems();
        this.initShowItems();
        this.initShowWhale();
    }

    initGroups() {
        this.groups = fromHtml(groupsTemplate({
            groups: this.items.map((name, index) => {
                return {
                    name: name,
                    comparee: this.items[index + 1],
                    notLast: index < this.items.length - 1
                }
            })
        }));

        this.$context.appendChild(this.groups.root);
    }

    initRandomItems() {
        let items = new Set();

        do {
            items.add(this.settings.items[Math.floor(Math.random() * this.settings.items.length)]);
        } while(items.size < 3 );

        this.items = [...items];
    }

    initClickItems() {
        this.$context.addEventListener('click', async (e) => {
            e.stopPropagation();
            let itemElement = e.target;

            if (itemElement.matches('.js-item')) {
                await this.moveItemToGroup(itemElement);
                this.updateEquality();
            }

            if (itemElement.matches('.js-coin')) {
                this.hideCoin(itemElement);
            }
        });
    }

    moveItemToGroup(itemElement) {
        return new Promise((resolve) => {
            let itemName = itemElement.dataset.item;
            let groupElement = this.groups[itemName];
            let groupPosition = groupElement.getBoundingClientRect();
            let groupCenter = {
                x: (groupPosition.x + (groupPosition.width / 2)) / window.innerWidth * 100,
                y: (groupPosition.y + (groupPosition.height / 2)) / window.innerHeight * 100
            };
            itemElement.classList.add('item--counted');
            itemElement.style.top = (groupCenter.y + (Math.random() * 5)) + '%'
            itemElement.style.left = (groupCenter.x + (Math.random() * 5)) + '%'
            setTimeout(() => {
                groupElement.appendChild(itemElement);
                resolve();
            }, 300);
        });
    }

    updateEquality() {
        this.groups.equality.forEach((euality) => {
            let aElement = this.groups[euality.dataset.a];
            let bElement = this.groups[euality.dataset.b];
            let aCountElement = this.groups[euality.dataset.a + 'Count'];
            let bCountElement = this.groups[euality.dataset.b + 'Count'];
            let a = aElement.querySelectorAll('.js-item').length;
            let b = bElement.querySelectorAll('.js-item').length;
            let prevValue = euality.innerText;

            aCountElement.innerText = a;
            bCountElement.innerText = b;

            if(a < b) {
                euality.innerText = '<';
            } else if (a > b) {
                euality.innerText = '>';
            } else if (a == b) {
                euality.innerText = '=';
            } else {
                euality.innerText = ' ';
            }

            if(prevValue != euality.innerText) {
                this.showCoin();
            }
        });
    }

    async initShowItems() {
        while(true) {
            await this.showItem();
        }
    }

    async initShowWhale() {
        while(true) {
            await this.showWhale();
        }
    }

    showItem() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.$items.querySelectorAll('.js-item').length < this.settings.maxItems) {
                    let newItemIndex = Math.floor(Math.random() * this.items.length);
                    let newItem = fromHtml(itemTemplate({
                        item: this.items[newItemIndex],
                        x: (Math.random() * 80 + 10) + '%',
                        y: (Math.random() * 80 + 10) + '%',
                    })).item;
                    console.log(newItem);
                    this.$items.appendChild(newItem);
                    setTimeout(() => newItem.classList.add('item--visible'), 10);
                }
                resolve();
            }, this.settings.itemInterval + Math.floor(Math.random() * this.settings.itemIntervalRand));
        });
    }

    showWhale() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.$items.querySelectorAll('.js-coin').length > 0) {
                    this.$whale.classList.add('whale--active');
                    setTimeout(() => {
                        this.$whale.classList.remove('whale--active');
                        this.hideAllCoins();
                        resolve();
                    }, 300);
                } else {
                    resolve();
                }
            }, this.settings.whaleInterval + Math.floor(Math.random() * this.settings.whaleIntervalRand));
        });
    }

    showCoin() {
        let newCoin = fromHtml(coinTemplate({
            x: (Math.random() * 80 + 10) + '%',
            y: (Math.random() * 80 + 10) + '%',
        })).coin;
        this.$items.appendChild(newCoin);
        setTimeout(() => newCoin.classList.add('item--visible'), 10);
    }

    hideCoin(coin) {
        coin.classList.add('item--erned');
        setTimeout(() => coin.parentNode.removeChild(coin), 300);
        this.coins++;
        this.$coinCounter.innerText = this.coins;
    }

    hideAllCoins() {
        this.$items.querySelectorAll('.js-coin').forEach((coin) => {
            this.hideCoin(coin);
        });
    }
}

documentReady(() => {
    document.querySelectorAll('.js-clever-whale').forEach((element) => {
        new CleverWhale(element);
    });
});
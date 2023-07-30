class View {
  constructor() {
    this.searchBackground = this.createEl('div', 'background-search');
    this.searchBackground.style.width = '661px';
    this.searchBackground.style.height = '100vh';
    this.searchBackground.style.display = 'flex';
    this.searchBackground.style.flexDirection = 'column';
    this.searchBackground.style.alignItems = 'center';
    this.searchBackground.style.background = '#C4C4C4';
    this.searchBackground.style.margin = '0 auto';
    this.searchWrapper = this.createEl('div', 'wrapper-search');
    this.searchWrapper.style.maxWidth = '500px';
    this.searchIput = this.createEl('input', 'input-search');
    this.searchIput.style.width = '100%';
    this.searchIput.style.height = '61px';
    this.searchIput.style.margin = '62px 0 0 0 ';
    this.searchIput.style.padding = '0 0 0 13px';
    this.searchIput.style.outline = 'none';
    this.searchIput.style.border = 'none';
    this.searchIput.style.fontSize = '48px';
    this.searchIput.style.boxSizing = 'border-box';
    this.searchList = this.createEl('ul', 'search-list');

    this.searchList.style.width = '100%';
    this.searchList.style.margin = '0 0 40px 0';
    this.searchList.style.padding = '0';

    this.searchList.addEventListener('mouseover', function (e) {
      e.target.style.background = '#65CDF9';
      e.target.style.cursor = 'pointer';
    });
    this.searchList.addEventListener('mouseout', function (e) {
      e.target.style.background = '#E3E3E3';
    });

    document.body.append(this.searchBackground);
    this.searchBackground.append(this.searchWrapper);
    this.searchWrapper.append(this.searchIput);
    this.searchWrapper.append(this.searchList);
  }
  createEl(tagName, className) {
    const el = document.createElement(tagName);
    if (className) {
      el.classList.add(className);
    }
    return el;
  }
  createPost(name, owner, stars) {
    this.post = this.createEl('div', 'post');
    this.post.style.border = '1px solid';
    this.post.style.padding = '8px 16px';
    this.post.style.width = '100%';
    this.post.style.fontSize = '24px';
    this.post.style.background = '#E27BEB';
    this.post.style.boxSizing = 'border-box';
    this.post.style.display = 'flex';
    this.post.style.justifyContent = 'space-between';
    this.post.style.alignItems = 'center';

    this.info = this.createEl('div', 'post-info');
    this.info.style.maxWidth = '400px';
    this.info.style.overflow = 'hidden';
    this.nameTag = this.createEl('p', 'name');
    this.nameTag.style.margin = '0';
    this.nameTag.insertAdjacentHTML('afterbegin', `Name: ${name}`);
    this.ownerTag = this.createEl('p', 'name');
    this.ownerTag.style.margin = '0';
    this.ownerTag.insertAdjacentHTML('afterbegin', `Owner: ${owner}`);
    this.starsTag = this.createEl('p', 'name');
    this.starsTag.style.margin = '0';
    this.starsTag.insertAdjacentHTML('afterbegin', `Stars: ${stars}`);

    this.close = this.createEl('div', 'wrapper-close');
    this.close.style.width = '42px';
    this.close.style.height = '38.5px';
    this.close.style.overflow = 'hidden';
    this.close.style.cursor = 'pointer';
    this.lborder = this.createEl('div', 'wrapper-close');
    this.lborder.style.width = '120%';
    this.lborder.style.height = '120%';
    this.lborder.style.borderLeft = '4px solid #FF0000';
    this.lborder.style.transform = 'rotate(45deg) translate(35%, 3%)';
    this.rborder = this.createEl('div', 'wrapper-close');
    this.rborder.style.width = '120%';
    this.rborder.style.height = '120%';
    this.rborder.style.borderRight = '4px solid #FF0000';
    this.rborder.style.transform = 'rotate(-45deg) translate(10%,-83%)';
    this.close.append(this.lborder);
    this.close.append(this.rborder);

    this.info.append(this.nameTag);
    this.info.append(this.ownerTag);
    this.info.append(this.starsTag);
    this.post.append(this.info);
    this.post.append(this.close);

    this.searchWrapper.append(this.post);
  }
  createList(item) {
    this.searchName = this.createEl('li', 'search-listName');

    this.searchName.name = item.name;
    this.searchName.owner = item.owner.login;

    this.searchName.stars = item.stargazers_count;
    this.searchName.insertAdjacentHTML('afterbegin', `${this.searchName.name}`);
    this.searchName.style.listStyleType = 'none';
    this.searchName.style.height = '44px';
    this.searchName.style.width = '100%';
    this.searchName.style.overflow = 'hidden';
    this.searchName.style.background = '#E3E3E3';
    this.searchName.style.border = '2px solid';
    this.searchName.style.fontSize = '30px';
    this.searchName.style.padding = '0 0 0 13px';
    this.searchName.style.boxSizing = 'border-box';
    this.searchList.append(this.searchName);
  }
  removeItems() {
    const e = document.querySelector('ul');
    let child = e.lastElementChild;
    while (child) {
      e.removeChild(child);
      child = e.lastElementChild;
    }
  }
  debounce(f, ms) {
    let timeout;
    return function () {
      const fnCall = () => f.apply(this, arguments);
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
    };
  }
}

class Search {
  constructor(view) {
    this.view = view;

    this.view.searchIput.addEventListener(
      'keyup',
      this.view.debounce(this.keySearch.bind(this), 700)
    );
    this.view.searchWrapper.addEventListener('click', function (e) {
      if (e.target.name) {
        view.createPost(e.target.name, e.target.owner, e.target.stars);
        view.searchIput.value = '';
        view.removeItems();
      }
      if (e.target.classList == 'wrapper-close') {
        e.target.closest('.post').remove();
      }
    });
  }
  async keySearch() {
    console.log(this);
    this.view.removeItems();
    if (this.view.searchIput.value !== '') {
      await fetch(
        `https://api.github.com/search/repositories?q=${this.view.searchIput.value}`
      ).then((res) => {
        res.json().then((res) => {
          if (res.total_count > 5) {
            for (let i = 0; i < 5; i++) {
              this.view.createList(res.items[i]);
            }
          } else {
            for (let i = 0; i < res.total_count; i++) {
              this.view.createList(res.items[i]);
            }
          }
        });
      });
    }
  }
}
new Search(new View());

let currentObserver: any = null;

const observe = (fn: any) => {
  currentObserver = fn;
  fn();
  currentObserver = null;
};

export const observable = (obj: any) => {
  const observerMap: any = {};

  return new Proxy(obj, {
    get(target, name) {
      observerMap[name] = observerMap[name] || new Set();
      if (currentObserver) observerMap[name].add(currentObserver);
      return target[name];
    },
    set(target, name, value) {
      if (target[name] === value) return true;
      if (JSON.stringify(target[name]) === JSON.stringify(value)) return true;
      target[name] = value;
      observerMap[name].forEach((fn: any) => fn());
      return true;
    },
  });
};

const createContainerEl = () => {
  const container = document.createElement('div');
  container.style.margin = '6px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  const emoTitle = document.createElement('span');
  emoTitle.textContent = '이모티콘 목록';

  const emoListContainer = document.createElement('div');
  emoListContainer.style.height = '60px';
  emoListContainer.style.border = '1px solid white';
  emoListContainer.style.display = 'hidden';

  const emoButton = document.createElement('button');
  emoButton.textContent = '확인';
  emoButton.style.marginTop = '1.5rem';
  emoButton.style.width = '6rem';
  emoButton.style.border = '1px solid white';
  emoButton.style.color = '#aaa';
  emoButton.addEventListener('mouseover', () => {
    emoButton.style.backgroundColor = '#aaa';
    emoButton.style.color = '#333';
  });
  emoButton.addEventListener('mouseout', () => {
    emoButton.style.backgroundColor = 'transparent';
    emoButton.style.color = '#aaa';
  });

  container.appendChild(emoTitle);
  container.appendChild(emoListContainer)
  container.appendChild(emoButton);

  return { container, emoButton };
};

export const emoticonToolbarIcon = () => {
  const state = observable({ isOpen: false })
  const { container, emoButton } = createContainerEl();

  const toolbar = {
    toolbarItems: [
      {
        groupIndex: 4,
        itemIndex: 3,
        item: {
          name: 'emoticon',
          tooltip: '이모티콘 삽입',
          className: 'toastui-editor-toolbar-icons',
          style: {
            backgroundImage: 'url(/youtube.png)',
            backgroundSize: '25px',
            backgroundPosition: 'center center',
          },
          popup: {
            className: 'popup-wrapper',
            body: container,
          },
        },
      },
    ],
  };
  return toolbar;
};

const createContainerEl = () => {
  const container = document.createElement('div');
  container.style.margin = '6px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  const ytText = document.createElement('span');
  ytText.textContent = '유튜브 영상 주소';

  const ytInput = document.createElement('input');
  ytInput.placeholder = '유튜브 링크';
  ytInput.style.marginTop = '.5rem';
  ytInput.style.height = '1.5rem';
  ytInput.style.padding = '0 .5rem';
  ytInput.style.color = '#333';

  const ytButton = document.createElement('button');
  ytButton.textContent = '확인';
  ytButton.style.marginTop = '1.5rem';
  ytButton.style.width = '6rem';
  ytButton.style.border = '1px solid white';
  ytButton.style.color = '#aaa';
  ytButton.addEventListener('mouseover', () => {
    ytButton.style.backgroundColor = '#aaa';
    ytButton.style.color = '#333';
  });
  ytButton.addEventListener('mouseout', () => {
    ytButton.style.backgroundColor = 'transparent';
    ytButton.style.color = '#aaa';
  });

  container.appendChild(ytText);
  container.appendChild(ytInput);
  container.appendChild(ytButton);

  return { container, ytInput, ytButton };
};

const getYoutubeId = (url: string) => {
  const urlObj = new URL(url);
  if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
  const queryId = urlObj.searchParams.get('v');
  if (queryId) return queryId;
  return null;
};

export const createYoutubeToolbarIcon =
  (editorRef: React.MutableRefObject<any>) => () => {
    const { container, ytInput, ytButton } = createContainerEl();

    ytButton.onclick = () => {
      const value = ytInput.value;

      if (!value) return;
      if (!(value.includes('youtu.be') || value.includes('youtube.com'))) {
        alert('유튜브 링크 확인');
        ytInput.value = '';
        return;
      }

      const youtubeId = getYoutubeId(value);
      if (!youtubeId) {
        alert('유튜브 ID 확인');
        ytInput.value = '';
        return;
      }
      const existHTML = editorRef.current.getInstance().getHTML();
      editorRef.current
        .getInstance()
        .setHTML(
          existHTML +
            `<p><br></p><img src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg" contenteditable="false" />`
        );
      ytInput.value = '';
    };

    const toolbar = {
      toolbarItems: [
        {
          groupIndex: 4,
          itemIndex: 2,
          item: {
            name: 'youtube',
            tooltip: '유튜브 삽입',
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

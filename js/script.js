document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    // 更新笔记列表，包含子文件夹路径
    const notes = [
        '恩施/恩施.md',
        '岳阳/岳阳.md'
    ];

    // 动态生成笔记链接
    notes.forEach(note => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        // 显示文件名（去除路径和 .md 扩展名）
        a.textContent = note.split('/')[1].replace('.md', '');
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadNote(note);
        });
        li.appendChild(a);
        notesList.appendChild(li);
    });

    // 加载和渲染 Markdown 文件
    function loadNote(note) {
        const filePath = `notes/${note}`;
        noteContent.innerHTML = '<p>加载中...</p>'; // 添加加载提示
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`无法加载 ${filePath}，状态码：${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                noteTitle.textContent = note.split('/')[1].replace('.md', '');
                noteContent.innerHTML = marked.parse(data);
            })
            .catch(error => {
                noteTitle.textContent = '加载错误';
                noteContent.innerHTML = `<p>加载笔记失败：${error.message}</p><p>请确认文件位于 <code>notes/${note}</code>，并已推送到 GitHub。</p>`;
            });
    }

    // 默认加载第一个笔记（如果存在）
    if (notes.length > 0) {
        loadNote(notes[0]);
    }
});
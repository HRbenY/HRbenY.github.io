document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    const notes = [
        '恩施/恩施.md',
        '岳阳/岳阳.md'
    ];

    notes.forEach(note => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = note.split('/')[1].replace('.md', '');
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadNote(note);
        });
        li.appendChild(a);
        notesList.appendChild(li);
    });

    function loadNote(note) {
        const filePath = `notes/${note}`;
        // 提取当前 Markdown 文件的目录（例如 notes/恩施/ 或 notes/岳阳/）
        const directory = `notes/${note.split('/')[0]}/`;
        noteContent.innerHTML = '<p>加载中...</p>';
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`无法加载 ${filePath}，状态码：${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                noteTitle.textContent = note.split('/')[1].replace('.md', '');
                // 渲染 Markdown
                let html = marked.parse(data);
                // 动态调整图片路径
                html = html.replace(/<img([^>]*?)src="([^"]+)"([^>]*?)>/g, (match, p1, src, p2) => {
                    // 如果 src 已经是绝对路径（以 http:// 或 https:// 开头），不修改
                    //if (src.startsWith('http://') || src.startsWith('https://')) {
                    //    return match;
                    //}
                    // 如果 src 已包含 notes/，不修改（避免重复添加前缀）
                    if (src.startsWith('notes/')) {
                        return match;
                    }
                    // 否则，添加动态目录前缀（例如 notes/恩施/ 或 notes/岳阳/）
                    const newSrc = `${directory}${src}`;
                    return `<img${p1}src="${newSrc}"${p2}>`;
                });
                noteContent.innerHTML = html;
            })
            .catch(error => {
                noteTitle.textContent = '加载错误';
                noteContent.innerHTML = `<p>加载笔记失败：${error.message}</p><p>请确认文件位于 <code>notes/${note}</code>，并已推送到 GitHub。</p>`;
            });
    }

    if (notes.length > 0) {
        loadNote(notes[0]);
    }
});
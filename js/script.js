// 假设 notes 文件夹中的 Markdown 文件列表
const notes = [
    'note1.md',
    'note2.md'
    // 添加更多笔记文件
];

document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    // 动态生成笔记链接
    notes.forEach(note => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = note.replace('.md', '');
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadNote(note);
        });
        li.appendChild(a);
        notesList.appendChild(li);
    });

    // 加载和渲染 Markdown 文件
    function loadNote(note) {
        fetch(`notes/${note}`)
            .then(response => {
                if (!response.ok) throw new Error('无法加载笔记');
                return response.text();
            })
            .then(data => {
                noteTitle.textContent = note.replace('.md', '');
                noteContent.innerHTML = marked.parse(data);
            })
            .catch(error => {
                noteTitle.textContent = '错误';
                noteContent.innerHTML = '<p>加载笔记失败，请检查文件路径。</p>';
            });
    }

    // 默认加载第一个笔记（可选）
    if (notes.length > 0) {
        loadNote(notes[0]);
    }
});
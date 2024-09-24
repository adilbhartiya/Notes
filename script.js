const addBtn = document.getElementById('add');

const notes = JSON.parse(localStorage.getItem('notes')) || [];

if (notes.length > 0) {
    notes.forEach(note => addNewNote(note));
}

addBtn.addEventListener('click', () => addNewNote());

function addNewNote(noteData = { title: '', content: '' }) {
    const note = document.createElement('div');
    note.classList.add('note');

    note.innerHTML = `
    <div class="tools">
        <input type="text" class="note-title" placeholder="Title here..." value="${noteData.title}">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main ${noteData.content ? "" : "hidden"}"></div>
    <textarea class="${noteData.content ? "hidden" : ""}">${noteData.content}</textarea>
    <div class="resize-handle"></div>
    `;

    const titleInput = note.querySelector('.note-title');
    const editBtn = note.querySelector('.edit');
    const deleteBtn = note.querySelector('.delete');
    const main = note.querySelector('.main');
    const textArea = note.querySelector('textarea');
    const resizeHandle = note.querySelector('.resize-handle');
    const tools = note.querySelector('.tools');

    main.innerHTML = marked(noteData.content);

    deleteBtn.addEventListener('click', () => {
        note.remove();
        updateLS();
    });

    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
    });

    titleInput.addEventListener('input', updateLS);

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);
        updateLS();
    });

    // Add event listeners for showing/hiding edit and delete buttons
    note.addEventListener('mouseenter', () => {
        editBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';
    });

    note.addEventListener('mouseleave', () => {
        editBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
    });

    let isResizing = false;
    let startX, startWidth;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(note).width, 10);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        if (!isResizing) return;
        const width = startWidth + (e.clientX - startX);
        if (width >= 200 && width <= 800) {
            note.style.width = `${width}px`;
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    document.body.appendChild(note);
    
    // Initially hide the buttons
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
}

function updateLS() {
    const notes = Array.from(document.querySelectorAll('.note')).map(noteEl => ({
        title: noteEl.querySelector('.note-title').value,
        content: noteEl.querySelector('textarea').value
    }));
    localStorage.setItem('notes', JSON.stringify(notes));
}
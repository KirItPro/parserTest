const DOCUMENT_IMG = "img/file.png",
    DOCUMENT_IMG_COLORED = "img/file-active.png",
    ADD_FILE_ANOTHER = 'Выбрать другой Файл',
    ADD_FILE = 'Выбрать Файл',
    DRAG_AND_DROP = 'Перетащите файл с профилями';

window.addEventListener('DOMContentLoaded', () => {
    let fileName = '';
    let base64 = '';
    const dragAndDrop = document.querySelector('.drag-and-drop'),
        pushBlock = document.querySelector('.add-file'),
        inputText = document.querySelector('.main-input'),
        btnAnotherFile = pushBlock.querySelector('.btn-active'),
        inputFile = pushBlock.querySelector('.input'),
        prevText = pushBlock.querySelector('.add-file_text'),
        img = document.querySelector('.add-file_img'),
        bufferBtn = document.querySelector('#buf-add-btn'),
        cancelBtn = document.querySelector('#cancel-btn'),
        titltFile= pushBlock.querySelector('.add-file_title'),
        mainBlock = document.querySelector('#main-add'),
        parseDataBtn = document.querySelector('#btn-parse');

    function updateParseBtn () {
            if (base64 || inputText.value) {
                parseDataBtn.classList.add('btn-active');
                parseDataBtn.removeAttribute('disabled')
            } else {
                parseDataBtn.classList.remove('btn-active')
                parseDataBtn.setAttribute('disabled', true)
            }
        };
    
    function uploadFile () {
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dragAndDrop.style.display = 'flex'
        });
        dragAndDrop.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragAndDrop.style.display = 'none';
        });
        dragAndDrop.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        dragAndDrop.addEventListener('drop', (e) => {
            e.preventDefault();
            dragAndDrop.style.display = 'none';
            pushBlock.style.display = 'none';
            pushBlock.style.display = 'block';
            parseDataBtn.classList.add('btn-active');
            
            const file = e.dataTransfer?.files?.[0];

            fileName = file.name;
            inputText.hidden = true;
            prevText.hidden = true;
            titltFile.innerHTML = `${fileName}`;
            btnAnotherFile.innerHTML = ADD_FILE_ANOTHER;
            img.setAttribute('src', DOCUMENT_IMG_COLORED);
            bufferBtn.hidden = true;
            cancelBtn.hidden = false;

            selectFile(file)
            updateParseBtn ();
        });
    };

    function clickOnBtnAdd () {
        btnAnotherFile.addEventListener('click', () => {
            inputFile.click();
        });    
    };

    function changeOrAddFile() {
        inputFile.addEventListener('change', function(e) {
            fileName = this.files[0].name;
            inputText.hidden = true;
            prevText.hidden = true;
            bufferBtn.hidden = true;
            cancelBtn.hidden = false;
            titltFile.innerHTML = `${fileName}`;
            img.setAttribute('src', DOCUMENT_IMG_COLORED)
            btnAnotherFile.innerHTML = ADD_FILE_ANOTHER;
            parseDataBtn.classList.add('btn-active');
        });
    };

    function cancel() {
        cancelBtn.addEventListener('click', (e) => {
            bufferBtn.hidden = false;
            cancelBtn.hidden = true;
            prevText.hidden = false;
            btnAnotherFile.innerHTML = ADD_FILE;
            img.setAttribute('src', DOCUMENT_IMG);
            titltFile.innerHTML = DRAG_AND_DROP;
            inputText.hidden = false;
            base64 = '';
            updateParseBtn ();
        })
    };

    function addOnInputText () {
        inputText.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                mainBlock.style.display = 'none';
                inputText.classList.add('main-input_fullscreen');
            } else {
                mainBlock.style.display = 'block';
                inputText.classList.remove('main-input_fullscreen');
            }
            updateParseBtn ();
        });
        
    };

    function pasteFromBuffer () {
        navigator.clipboard.readText().then(text => {
            inputText.value = text;
            mainBlock.style.display = 'none';
            inputText.classList.add('main-input_fullscreen');
            inputText.focus();
            updateParseBtn ();
        })
    };

    function getBase64FromString(str) {
        const base64Index = str.indexOf('base64;');
        return str.slice(base64Index + 7);
    };

    function selectFile(file) {            
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener('load', () => {
            base64 = getBase64FromString(reader.result);
            updateParseBtn ();
        });            
    };

    function sendData() {
        console.log('Data for parsing: ', base64 || inputText.value);
    };

    updateParseBtn ();
    addOnInputText ();
    uploadFile ();
    clickOnBtnAdd ();
    cancel();
    changeOrAddFile();
    bufferBtn.addEventListener('click', pasteFromBuffer);
    parseDataBtn.addEventListener('click', sendData);
})

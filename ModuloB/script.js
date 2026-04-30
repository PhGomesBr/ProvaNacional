const btnUpload =document.getElementById('btn-upload');
const inputFile = document.getElementById('input-file')


btnUpload.addEventListener('click', ()=>{
    document.getElementById('input-file').click()
});

inputFile.addEventListener('change', (e) => {
    const arquivo = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) =>{
        
    }
})
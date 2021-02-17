const search = document.getElementById("search");
const noteList = document.getElementById("note-list");

function xhrNoteList() {
  // Buat object Ajax
  const xhr = new XMLHttpRequest();

  // Cek kesiapan Ajax
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      noteList.innerHTML = xhr.responseText;
    } else {
      noteList.innerHTML = `
      <div style="margin-top: 100px; display: flex; justify-content: center; align-items: center;">
        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      `;
    }
  };

  // Eksekusi Ajax
  xhr.open("GET", `/file?path=pages/index/xhr/note-list.ejs`);
  xhr.open("GET", `/search?keyword=${search.value}`);
  xhr.send();
}

xhrNoteList();
search.addEventListener("keyup", () => {
  xhrNoteList();
});

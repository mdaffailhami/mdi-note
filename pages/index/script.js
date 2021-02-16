const search = document.getElementById("search");
const noteList = document.getElementById("note-list");

function xhrNoteList() {
  // Buat object Ajax
  const xhr = new XMLHttpRequest();

  // Cek kesiapan Ajax
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      noteList.innerHTML = xhr.responseText;
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

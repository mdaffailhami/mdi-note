const search = document.getElementById("search");
const noteList = document.getElementById("note-list");

function getNote() {
  // Buat object Ajax
  const xhr = new XMLHttpRequest();

  // Cek kesiapan Ajax
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      const response = JSON.parse(xhr.response);

      if (xhr.status == 200 && response.status == "success") {
        if (response.notes.length == 0) {
          noteList.innerHTML = `
            <div
            id="not-found"
              style="
                margin-top: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
              "
            >
              <h3 class="text-muted">Item not found!!!</h3>
              <img
                src="file?path=pages/index/assets/images/not-found.gif"
                alt=""
                style="border-radius: 10px; margin-top: 5px;"
              />
            </div>
          `;
        } else {
          const notes = response.notes.map((element, index) => {
            return `
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse${index}"
                    aria-expanded="false"
                    aria-controls="collapse${index}"
                    style="font-size: 17px"
                  >
                    ${element.title}
                  </button>
                </h2>
                <div
                  id="collapse${index}"
                  class="accordion-collapse collapse"
                  aria-labelledby="heading${index}"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div id="kolom-kiri" style="white-space: pre-line">${element.content}</div>
                    <div id="kolom-kanan">
                      <!-- action button in mobile -->
                      <div id="three-dots-button" class="btn-group dropstart">
                        <img
                          data-bs-display="static"
                          data-bs-toggle="dropdown"
                          src="/file?path=pages/index/assets/images/three-dots-menu.jpg"
                          alt=""
                          width="16"
                        />
                        <ul class="dropdown-menu p-2 text-left bg-primary">
                          <a href="/update/${element._id}"><li
                            class="update-button"
                            note-_id="${element._id}"
                            note-title="${element.title}"
                            note-content="${element.content}"
                          >
                            Edit
                          </li></a>
                          <li
                            class="delete-button"
                            note-_id="${element._id}"
                            note-title="${element.title}"
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
            
                      <!-- action button in desktop -->
                      <div id="action-button">
                        <a href="/update/${element._id}"><button
                          type="button"
                          class="update-button btn btn-primary"
                          note-_id="${element._id}"
                          note-title="${element.title}"
                          note-content="${element.content}"
                        >
                          Edit
                        </button></a>
                        <button
                          type="button"
                          class="delete-button btn btn-primary"
                          note-_id="${element._id}"
                          note-title="${element.title}"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
          });
          // Mengisi ke HTML
          noteList.innerHTML = notes.join("");
        }

        // Memanggil method yg akan dijalankan ketika sudah terender
        deleteNote();
      } else {
        alert("Request ERROR!!!");
      }
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

  xhr.open("GET", `/api/note?keyword=${search.value}`);
  xhr.send();
}

function deleteNote() {
  const deleteButton = document.querySelectorAll(".delete-button");

  for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click", () => {
      const attribute = {
        _id: deleteButton[i].getAttribute("note-_id"),
        title: deleteButton[i].getAttribute("note-title"),
      };

      const konfirmasi = confirm(`Yakin ingin menghapus "${attribute.title}"?`);

      if (konfirmasi) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            const response = JSON.parse(xhr.response);
            if (response.status == "success") {
              getNote();
              // document.location.href = "/";
            } else {
              alert("DELETE Failed!!!");
            }
          }
        };

        xhr.open("DELETE", `/api/note?_id=${attribute._id}`);
        xhr.send();
      }
    });
  }
}

// Start
getNote();
// Update
search.addEventListener("keyup", () => {
  getNote();
});

const submitButton = document.querySelector("button");

submitButton.addEventListener("click", () => {
  const formData = {
    title: document.querySelector("input").value,
    content: document.querySelector("textarea").value,
    __v: document.querySelector("button").getAttribute("note-__v"),
    _id: document.querySelector("button").getAttribute("note-_id"),
  };

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        window.location.href = "/";
      } else {
        alert("Save failed!!!");
      }
    }
  };

  xhr.open("PUT", `/api/note?_id=${formData._id}`);
  xhr.send(`title=${formData.title}&content=${formData.content}`);
});

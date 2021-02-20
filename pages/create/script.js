const submitButton = document.querySelector("button");

submitButton.addEventListener("click", () => {
  const formData = {
    title: document.querySelector("input").value,
    content: document.querySelector("textarea").value,
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

  xhr.open("POST", "/api/note");
  //Send the proper header information along with the request
  // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(`title=${formData.title}&content=${formData.content}`);
});

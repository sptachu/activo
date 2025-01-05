document.getElementById("btn").onclick = async () => {
    let json = await fetchPostAsync()
    console.log(json)
    if (json === 0){
        alert("Rejestracja udana, przenoszenie na stronę logowania")
        window.location = 'http://127.0.0.1:4567/login.html';
    } else if (json === 1) {
        alert("Taki użytkownik już istnieje")
    } else if (json === 2){
        alert("Brak nazwy użytkownika lub hasła")
    } else {
        alert("Inny błąd")
    }

}
fetchPostAsync = async () => {
    const dat = JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    })

    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/register", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}
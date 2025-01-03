document.getElementById("submitActivityBtn").onclick = async () => {
    let json = await fetchPostAsync()
    console.log(json)
    if (json){
        window.location = 'http://127.0.0.1:4567/';
    } else {
        window.location = 'http://127.0.0.1:4567/login.html';
    }
    alert(JSON.stringify(json, null, 5))
}
fetchPostAsync = async () => {
    const dat = JSON.stringify({
        title: document.getElementById("title").value,
        time: document.getElementById("time").value,
        type: document.getElementById("type").value,
        duration: document.getElementById("hours").value+":"+
            document.getElementById("minutes").value+":"
            +document.getElementById("seconds").value,
        location: document.getElementById("location").value,
        elevation: document.getElementById("elevation").value,
        distance: document.getElementById("distance").value,
    })

    const options = {
        method: "POST",
        body: dat,
    }

    let response = await fetch("/addActivity", options)

    if (!response.ok) {
        return response.status
    }
    else {
        return await response.json() // response.json
    }

}
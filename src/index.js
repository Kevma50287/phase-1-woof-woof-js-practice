const pupURL = 'http://localhost:3000/pups'

document.addEventListener('DOMContentLoaded', () => {
    
    //grab elements
    const dogBar = document.getElementById('dog-bar')
    const dogInfo = document.getElementById('dog-info')
    const GoodDogFilter = document.getElementById('good-dog-filter')

    //render images
    const fetchPups = async () => {
        const res = await fetch(pupURL)
        const data = await res.json()
        data.forEach(element => {
            
            //create obj to save server data 
            let elInfoObj = {
                image: element.image,
                name: element.name,
                isGoodDog: element.isGoodDog,
                id: element.id
            }

            //create span element that takes a class of isGoodDog
            let span = document.createElement('span')
            span.textContent = element.name
            span.className=elInfoObj.isGoodDog
        
            //pass infoObj and Span as arguments that nested functions will perform
            span.addEventListener('click', (e) => handleDisplay(e, elInfoObj, span))

            dogBar.append(span)
        });
    }

    //sets the center display acocrding to info provided by the server in infoObj
    const handleDisplay = (e, elInfoObj, span) => {

        //change display based on click
        dogInfo.innerHTML = `<img src=${elInfoObj.image} class='${GoodBadIf(elInfoObj)}'/>
        <h2>${elInfoObj.name}</h2>
        <button>${GoodBadIf(elInfoObj)}</button>`

        //create button functionality
        dogInfo.querySelector('button').addEventListener('click', (e) => GoodBadFunction(e, elInfoObj, span))
        console.log(elInfoObj)
    }

    //patch the isGoodDog key:value on the server
    const GoodBadFunction = (e, elInfoObj, span) => {
        let patchObj = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isGoodDog: !elInfoObj.isGoodDog
            })
        }

        //negate the value on the DOM and object stored locally
        elInfoObj.isGoodDog = !elInfoObj.isGoodDog
        span.className = elInfoObj.isGoodDog

        fetch(`${pupURL}/${elInfoObj.id}`, patchObj)
        .then(res => res.json())
        .then(data => {
            e.target.textContent = GoodBadIf(data)
        })
    }

    //determines what the button should display given the info in Obj.isGoodDog
    const GoodBadIf = (object) => {
        let goodBad 
        if (object.isGoodDog) {
            goodBad = 'Good Dog'
        } else {
            goodBad = 'Bad Dog'
        }
        return goodBad
    }

    //changes the filter on click
    GoodDogFilter.addEventListener('click', (e) => {
        let dogBarArr = dogBar.childNodes

        //if filter is turned on, we set the display to none for bad dogs
        if (e.target.textContent === 'Filter good dogs: OFF'){
            e.target.textContent = 'Filter good dogs: ON';
            dogBarArr.forEach((element) => {
                if (element.className === 'false'){
                    element.style.display = 'none'
                }
            })
        
        //when turned off, revert the display back to flex
        } else {
            e.target.textContent = 'Filter good dogs: OFF'
            dogBarArr.forEach((element) => {
                if (element.className === 'false'){
                    element.style.display = 'flex'
                }
            })
        }
        
    })

    //initiate rendering
    fetchPups()


})


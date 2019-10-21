
function gameRules(){
    let button = document.getElementById('button');
    button.addEventListener('click',  showRules = () => {
        let rules = document.getElementById('rules');
        if (rules.style.display === 'none'){
            rules.style.display = 'block'
        } else {
            rules.style.display = 'none'
        }
    })
}


gameRules();


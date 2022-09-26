
const btn = document.querySelector("#askForHint");
btn.addEventListener('click', () =>
{
    console.log(taskResolvedSuccefully)
    if (taskResolvedSuccefully){
        document.querySelector("#btn-siguente").disabled = false;
    }
})

const btn = document.querySelector("#askForHint");
btn.addEventListener('click', () =>
{
    if (taskResolvedSuccefully){
        document.querySelector("#btn-siguente").disabled = false;
        document.querySelector("#id_solved").value = true;
    }
})
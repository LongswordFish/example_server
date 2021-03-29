//fetch all the delete buttons and assign their references to an array
const buttons = document.querySelectorAll(".delButtons");

//loop through the array and assign a click event listener 
buttons.forEach((button)=>{

    button.addEventListener("click",(e)=>{
   
        const id = button.dataset.id;
        const title=   button.dataset.title;

        const confirmResult = confirm(`You are about to delete ${title}`);

        if(!confirmResult)
        { 
            //prevent the form from being submitted
            e.preventDefault();
        }

        else
        {
            //generate a fetch or XHR request here
      
        }
    });
})